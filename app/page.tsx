// Fake Stripe Button State
  const [bribeText, setBribeText] = useState("HIDE SCORE ($99)");

  // Web Audio API for Heavy Mechanical Boom (No external assets needed)
  const playMechanicalBoom = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(100, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.error("Audio blocked");
    }
  };

  const rewriteInRust = () => {
    playMechanicalBoom();
    alert("⚠️ SYSTEM FAULT: Let's be honest, you don't know how borrow checkers work. Go back to JavaScript.");
  };

  const attemptBribe = () => {
    setBribeText("PROCESSING...");
    setTimeout(() => {
      playMechanicalBoom();
      setBribeText("HIDE SCORE ($99)");
      alert("🛑 STRIPE ERROR: Transaction declined. Your bank detected critical skill issues and refused to fund this cover-up.");
    }, 1500);
  };

  const copyApologyPR = () => {
    const prText = `Title: [URGENT] Total Rewrite & Formal Apology\n\nDescription:\nI am so sorry. I wrote the original code at 3 AM and I clearly didn't know what I was doing. Repo Roaster just exposed my ${result?.roastScore || 100}% Clown Score. \n\nPlease accept these changes. Do not fire me. I will read the documentation this time.`;
    navigator.clipboard.writeText(prText);
    alert("🏳️ APOLOGY PR COPIED. Go beg for forgiveness.");
  };
