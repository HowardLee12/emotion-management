import { useState, useEffect, useCallback } from "react";
import { CATS, SAMPLE_TASKS, REWARDS } from "../data/quizData";
import { Toast, Card, Chip, Btn, SH1, Sheet, inputStyle } from "./ui/SharedUI";

function AddForm({ members, onAdd }) {
  const [f, setF] = useState({ title: "", cat: "cook", who: 0, pts: 10 });
  return <>
    <input value={f.title} onChange={e => setF(x => ({...x, title: e.target.value}))} placeholder="輸入任務名稱..." style={inputStyle} autoFocus />
    <div style={{ fontSize: 13, color: "#8C8278", marginBottom: 8, fontWeight: 500 }}>類別</div>
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
      {CATS.map(c => <Chip key={c.id} active={f.cat === c.id} color={c.color} onClick={() => setF(x => ({...x, cat: c.id}))}>{c.icon} {c.label}</Chip>)}
    </div>
    <div style={{ fontSize: 13, color: "#8C8278", marginBottom: 8, fontWeight: 500 }}>指派給</div>
    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      {members.map((m, i) => (
        <button key={i} onClick={() => setF(x => ({...x, who: i}))} style={{ flex: 1, padding: "12px 8px", borderRadius: 14, border: f.who === i ? `2px solid ${m.color}` : "1.5px solid #EDE8E2", background: f.who === i ? `${m.color}08` : "white", cursor: "pointer", textAlign: "center", fontFamily: "'Noto Sans TC', sans-serif" }}>
          <div style={{ fontSize: 22 }}>{m.emoji}</div>
          <div style={{ marginTop: 4, fontSize: 13, color: f.who === i ? m.color : "#8C8278", fontWeight: f.who === i ? 600 : 400 }}>{m.name}</div>
        </button>
      ))}
    </div>
    <div style={{ fontSize: 13, color: "#8C8278", marginBottom: 8, fontWeight: 500 }}>點數</div>
    <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
      {[5,10,15,20].map(p => <Chip key={p} active={f.pts === p} color="#D4A843" onClick={() => setF(x => ({...x, pts: p}))}>{p} 💛</Chip>)}
    </div>
    <Btn full onClick={() => f.title.trim() && onAdd(f)}>確認新增</Btn>
  </>;
}

export default function MainApp({ familyName, initMembers, onSubscribe }) {
  const [tab, setTab] = useState("home");
  const [members, setMembers] = useState(initMembers);
  const [tasks, setTasks] = useState(SAMPLE_TASKS.map((t, i) => ({ ...t, who: i % initMembers.length })));
  const [toast, setToast] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [showCTA, setShowCTA] = useState(false);

  const flash = useCallback(msg => { setToast(msg); setTimeout(() => setToast(null), 2000); }, []);
  const totalPts = members.reduce((s, m) => s + m.points, 0);

  const [interactions, setInteractions] = useState(0);
  useEffect(() => { if (interactions >= 4 && !showCTA) setShowCTA(true); }, [interactions, showCTA]);

  const toggle = (id) => {
    setTasks(ts => ts.map(t => {
      if (t.id !== id) return t;
      if (!t.done) {
        setMembers(ms => ms.map((m, i) => i === t.who ? { ...m, points: m.points + t.pts, streak: m.streak + 1 } : m));
        flash(`+${t.pts} 💛 做得好！`);
        setInteractions(n => n + 1);
      } else {
        setMembers(ms => ms.map((m, i) => i === t.who ? { ...m, points: Math.max(0, m.points - t.pts) } : m));
      }
      return { ...t, done: !t.done, due: !t.done ? "已完成" : "今天" };
    }));
  };

  const reassign = (id) => {
    setTasks(ts => ts.map(t => t.id === id ? { ...t, who: (t.who + 1) % members.length } : t));
    setInteractions(n => n + 1);
  };

  const addTask = (form) => {
    setTasks(ts => [{ id: Date.now(), ...form, done: false, due: "待安排" }, ...ts]);
    flash("✨ 新任務已加入！");
    setInteractions(n => n + 1);
  };

  const redeem = (cost) => {
    if (totalPts < cost) return flash("❌ 點數不足");
    let rem = cost;
    setMembers(ms => {
      const s = [...ms].sort((a, b) => b.points - a.points);
      const deductions = {};
      for (const m of s) { const idx = ms.indexOf(m); const d = Math.min(m.points, rem); deductions[idx] = d; rem -= d; if (rem <= 0) break; }
      return ms.map((m, i) => ({ ...m, points: m.points - (deductions[i] || 0) }));
    });
    flash("🎉 兌換成功！");
  };

  const pending = tasks.filter(t => !t.done);
  const done = tasks.filter(t => t.done);
  const shown = filter === "all" ? pending : pending.filter(t => t.cat === filter);
  const bData = members.map((m, i) => ({ ...m, idx: i, count: pending.filter(t => t.who === i).length }));
  const bMax = Math.max(...bData.map(d => d.count), 1);
  const bAll = bData.reduce((s, d) => s + d.count, 0);

  const navItems = [
    { key: "home", icon: "🏠", label: "首頁" },
    { key: "miles", icon: "🏅", label: "里程碑" },
    { key: "rewards", icon: "🎁", label: "獎勵" },
  ];

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", position: "relative" }}>
      <Toast msg={toast} />

      {/* Header */}
      <div style={{ padding: "20px 20px 16px", background: "linear-gradient(180deg, #F5ECEC 0%, #FBF7F3 100%)", borderRadius: "0 0 28px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 22, fontWeight: 700, color: "#3A3330" }}>🏠 {familyName}</div>
            <div style={{ fontSize: 12, color: "#B0A498", marginTop: 2 }}>一起分擔，一起成長 🌱</div>
          </div>
          <div style={{ background: "white", borderRadius: 16, padding: "8px 14px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <div style={{ fontSize: 10, color: "#B0A498" }}>家庭愛心</div>
            <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 18, fontWeight: 700, color: "#D4A843" }}>💛 {totalPts}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {members.map((m, i) => (
            <div key={i} style={{ flex: 1, background: "white", borderRadius: 14, padding: "10px 6px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
              <div style={{ fontSize: 24 }}>{m.emoji}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#6B635C", marginTop: 2 }}>{m.name}</div>
              <div style={{ fontSize: 11, color: m.color, fontWeight: 500 }}>🔥 {m.streak}</div>
              <div style={{ fontSize: 10, color: "#C4B8AE" }}>{m.points} pts</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 20px", paddingBottom: 100 }}>

        {tab === "home" && <>
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <SH1>⚖️ 本週負擔分佈</SH1>
              {bData.length >= 2 && bData[0].count > bData[1].count * 1.8 && bData[1].count > 0 && (
                <span style={{ fontSize: 11, background: "#FFF3E0", color: "#E88B3E", padding: "4px 12px", borderRadius: 20, fontWeight: 500 }}>⚠️ 分配不均</span>
              )}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end", height: 76 }}>
              {bData.map((d, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: "#B0A498", marginBottom: 4 }}>{d.count} 項</div>
                  <div style={{ height: Math.max((d.count / bMax) * 50, 6), background: `linear-gradient(180deg, ${d.color}, ${d.color}66)`, borderRadius: "8px 8px 4px 4px", transition: "height 0.5s", margin: "0 auto", width: "65%" }} />
                  <div style={{ marginTop: 6, fontSize: 12, fontWeight: 500, color: "#6B635C" }}>{d.emoji} {d.name}</div>
                </div>
              ))}
            </div>
            {bAll > 0 && <div style={{ marginTop: 12, height: 6, borderRadius: 3, background: "#EDE8E2", display: "flex", overflow: "hidden" }}>
              {bData.map((d, i) => <div key={i} style={{ width: `${(d.count / bAll) * 100}%`, background: d.color, transition: "width 0.5s" }} />)}
            </div>}
          </Card>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, marginBottom: 12 }}>
            <SH1>📋 待辦事項 ({shown.length})</SH1>
            <Btn small onClick={() => setAddOpen(true)}>+ 新增</Btn>
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            <Chip active={filter === "all"} onClick={() => setFilter("all")}>全部</Chip>
            {CATS.map(c => <Chip key={c.id} active={filter === c.id} color={c.color} onClick={() => setFilter(c.id)}>{c.icon}</Chip>)}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {shown.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#C4B8AE" }}>🎉 沒有待辦事項！</div>}
            {shown.map(t => {
              const m = members[t.who]; const c = CATS.find(x => x.id === t.cat);
              return (
                <Card key={t.id} style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                  <button onClick={() => toggle(t.id)} style={{ width: 26, height: 26, borderRadius: "50%", border: t.done ? "none" : `2px solid ${c?.color}`, background: t.done ? c?.color : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "white", flexShrink: 0 }}>{t.done && "✓"}</button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: t.done ? "#C4B8AE" : "#3A3330", textDecoration: t.done ? "line-through" : "none" }}>{t.title}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, background: `${c?.color}11`, color: c?.color, padding: "2px 8px", borderRadius: 8, fontWeight: 500 }}>{c?.icon} {c?.label}</span>
                      <span style={{ fontSize: 11, color: "#C4B8AE" }}>{t.due}</span>
                      <span style={{ fontSize: 11, color: "#D4A843", fontWeight: 500 }}>+{t.pts} 💛</span>
                    </div>
                  </div>
                  <button onClick={() => reassign(t.id)} style={{ background: `${m?.color}11`, border: `1px solid ${m?.color}22`, borderRadius: 12, padding: "4px 10px", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                    {m?.emoji}<span style={{ fontSize: 11, color: "#8C8278" }}>{m?.name}</span>
                  </button>
                </Card>
              );
            })}
          </div>

          {done.length > 0 && <>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#C4B8AE", marginTop: 24, marginBottom: 8 }}>✅ 已完成 ({done.length})</div>
            {done.map(t => {
              const m = members[t.who]; const c = CATS.find(x => x.id === t.cat);
              return (
                <Card key={t.id} style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, opacity: 0.5, background: "#F5F0EC", marginBottom: 6 }}>
                  <button onClick={() => toggle(t.id)} style={{ width: 24, height: 24, borderRadius: "50%", border: "none", background: c?.color, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "white", flexShrink: 0 }}>✓</button>
                  <div style={{ flex: 1, fontSize: 13, color: "#B0A498", textDecoration: "line-through" }}>{t.title}</div>
                  <span style={{ fontSize: 12 }}>{m?.emoji}</span>
                </Card>
              );
            })}
          </>}

          {addOpen && <Sheet title="✨ 新增任務" onClose={() => setAddOpen(false)}>
            <AddForm members={members} onAdd={t => { addTask(t); setAddOpen(false); }} />
          </Sheet>}
        </>}

        {tab === "miles" && <>
          <SH1 style={{ marginBottom: 14 }}>🏅 家庭里程碑</SH1>
          {(() => {
            const maxStreak = Math.max(...members.map(m => m.streak), 0);
            const ms = [
              { t: "🌸 連續 7 天全家協作", ok: maxStreak >= 7, p: Math.min(100, Math.round((maxStreak/7)*100)) },
              { t: "🏆 完成 10 項任務", ok: done.length >= 10, p: Math.min(100, Math.round((done.length/10)*100)) },
              { t: "💎 累積 2000 愛心點數", ok: totalPts >= 2000, p: Math.min(100, Math.round((totalPts/2000)*100)) },
              { t: "🌈 連續 30 天不中斷", ok: maxStreak >= 30, p: Math.min(100, Math.round((maxStreak/30)*100)) },
            ];
            return <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ms.map((m, i) => (
                <Card key={i} style={{ border: m.ok ? "1px solid #D4A84333" : undefined, opacity: m.ok ? 1 : 0.7 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{m.t}</span>
                    {m.ok ? <span style={{ fontSize: 12, color: "#D4A843" }}>🎉 達成</span> : <span style={{ fontSize: 12, color: "#C4B8AE" }}>🔒</span>}
                  </div>
                  {!m.ok && <div style={{ marginTop: 8, height: 5, background: "#EDE8E2", borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", width: `${m.p}%`, background: "linear-gradient(90deg, #E8A0BF, #D4A843)", borderRadius: 3, transition: "width 0.5s" }} /></div>}
                </Card>
              ))}
            </div>;
          })()}
          <div style={{ marginTop: 32 }}><SH1>📊 數據洞察</SH1></div>
          <Card style={{ marginTop: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {members.map((m, i) => {
                const cnt = done.filter(t => t.who === i).length;
                const pct = done.length > 0 ? Math.round((cnt / done.length) * 100) : 0;
                return <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 30, fontWeight: 900, color: m.color }}>{pct}%</div>
                  <div style={{ fontSize: 12, color: "#8C8278", marginTop: 2 }}>{m.emoji} {m.name}</div>
                </div>;
              })}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 30, fontWeight: 900, color: "#9B7DC4" }}>{done.length}</div>
                <div style={{ fontSize: 12, color: "#8C8278" }}>已完成</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 30, fontWeight: 900, color: "#D4A843" }}>{Math.max(...members.map(m => m.streak), 0)}</div>
                <div style={{ fontSize: 12, color: "#8C8278" }}>最長連續</div>
              </div>
            </div>
          </Card>
        </>}

        {tab === "rewards" && <>
          <div style={{ background: "linear-gradient(135deg, #D4A84312, #E8A0BF08)", borderRadius: 24, padding: "28px 24px", textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 13, color: "#B0A498" }}>家庭共同點數</div>
            <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 42, fontWeight: 900, color: "#D4A843", marginTop: 4 }}>💛 {totalPts}</div>
          </div>
          <SH1>🎁 獎勵兌換</SH1>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            {REWARDS.map(r => {
              const ok = totalPts >= r.cost;
              return <Card key={r.id} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ fontSize: 28, width: 40, textAlign: "center", flexShrink: 0 }}>{r.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#3A3330" }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "#B0A498", marginTop: 2 }}>{r.desc}</div>
                </div>
                <Btn small disabled={!ok} onClick={() => redeem(r.cost)} style={{ background: ok ? "linear-gradient(135deg, #D4A843, #E88B3E)" : "#EDE8E2", boxShadow: "none" }}>{r.cost} 💛</Btn>
              </Card>;
            })}
          </div>
          <div style={{ marginTop: 32 }}><SH1>✨ 個人排行</SH1></div>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            {[...members].sort((a, b) => b.points - a.points).map((m, i) => (
              <Card key={i} style={{ display: "flex", alignItems: "center", gap: 12, border: i === 0 ? "1px solid #D4A84333" : undefined }}>
                <span style={{ fontSize: 20, width: 28, textAlign: "center" }}>{["🥇","🥈","🥉"][i] || ""}</span>
                <span style={{ fontSize: 26 }}>{m.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#3A3330" }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: "#B0A498" }}>🔥 {m.streak} 天</div>
                </div>
                <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 18, fontWeight: 700, color: m.color }}>{m.points}</div>
              </Card>
            ))}
          </div>
        </>}
      </div>

      {/* CTA Banner */}
      {showCTA && (
        <div style={{ position: "fixed", bottom: 68, left: "50%", transform: "translateX(-50%)", width: "calc(100% - 40px)", maxWidth: 440, zIndex: 60, animation: "sheetUp 0.4s ease" }}>
          <Card style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", boxShadow: "0 8px 32px rgba(0,0,0,0.1)", border: "1px solid #E8A0BF33" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#3A3330" }}>免費領《分工溝通指南》📖</div>
              <div style={{ fontSize: 12, color: "#8C8278", marginTop: 2 }}>5 個不吵架的對話範本</div>
            </div>
            <Btn small onClick={onSubscribe}>免費領取</Btn>
            <button onClick={() => setShowCTA(false)} style={{ background: "none", border: "none", color: "#C4B8AE", cursor: "pointer", fontSize: 14 }}>✕</button>
          </Card>
        </div>
      )}

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "#FBF7F3", borderTop: "1px solid #EDE8E2", display: "flex", padding: "8px 0 14px", zIndex: 50 }}>
        {navItems.map(n => (
          <button key={n.key} onClick={() => setTab(n.key)} style={{ flex: 1, border: "none", background: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, fontFamily: "'Noto Sans TC', sans-serif", padding: "6px 0", color: tab === n.key ? "#D4456A" : "#C4B8AE", fontWeight: tab === n.key ? 600 : 400 }}>
            <span style={{ fontSize: 20, lineHeight: 1 }}>{n.icon}</span>
            <span style={{ fontSize: 11 }}>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
