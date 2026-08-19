import { useState, useMemo, useRef, useCallback } from "react";
import {
  Flame,
  Beef,
  Wheat,
  Droplet,
  Plus,
  Trash2,
  Camera,
  Settings,
  X,
  AlertTriangle,
  CheckCircle2,
  UtensilsCrossed,
  Loader2,
  User,
  Sparkles,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Design tokens & global style                                       */
/* ------------------------------------------------------------------ */

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');

    .ct-root {
      --bg: #F6F7F2;
      --paper: #FFFFFF;
      --ink: #16241C;
      --muted: #6B7A70;
      --border: #E5E8E0;
      --border-soft: #EEF0EA;

      --cal-1: #059669;
      --cal-2: #0D9488;
      --over: #DC2626;
      --over-soft: #FEE2E2;

      --protein: #F59E0B;
      --protein-soft: #FEF3E2;
      --carbs: #2563EB;
      --carbs-soft: #EAF1FE;
      --fat: #8B5CF6;
      --fat-soft: #F3EEFE;

      background: var(--bg);
      color: var(--ink);
      font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      min-height: 100%;
      -webkit-font-smoothing: antialiased;
    }

    .ct-root * { box-sizing: border-box; }

    .ct-display {
      font-family: 'Space Grotesk', 'Inter', sans-serif;
      letter-spacing: -0.02em;
    }

    .ct-card {
      background: var(--paper);
      border: 1px solid var(--border);
      border-radius: 20px;
    }

    .ct-card-hover { transition: box-shadow 220ms ease, transform 220ms ease, border-color 220ms ease; }
    .ct-card-hover:hover {
      box-shadow: 0 10px 30px -14px rgba(22,36,28,0.18);
      transform: translateY(-2px);
      border-color: var(--border-soft);
    }

    /* Fuel-gauge bar with tick marks -- the signature element */
    .ct-gauge {
      position: relative;
      height: 22px;
      border-radius: 999px;
      background: repeating-linear-gradient(
        90deg,
        #EEF1EA 0px, #EEF1EA 6px,
        #E7EAE1 6px, #E7EAE1 7px
      );
      overflow: hidden;
      border: 1px solid var(--border);
    }
    .ct-gauge-fill {
      position: absolute;
      inset: 0;
      width: 0%;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--cal-1), var(--cal-2));
      transition: width 700ms cubic-bezier(.22,1,.36,1), background 400ms ease;
    }
    .ct-gauge-fill.over { background: linear-gradient(90deg, #EF4444, var(--over)); }
    .ct-gauge-fill::after {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        90deg, rgba(255,255,255,0.35) 0px, rgba(255,255,255,0.35) 1px,
        transparent 1px, transparent 18px
      );
    }

    .ct-gauge-sm { height: 10px; }

    @keyframes ct-pop {
      0% { transform: scale(0.9); opacity: 0; }
      60% { transform: scale(1.03); opacity: 1; }
      100% { transform: scale(1); }
    }
    .ct-modal-pop { animation: ct-pop 260ms cubic-bezier(.22,1,.36,1); }

    @keyframes ct-fade-in {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .ct-fade-in { animation: ct-fade-in 320ms ease both; }

    @keyframes ct-toast-in {
      from { opacity: 0; transform: translateY(12px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .ct-toast { animation: ct-toast-in 260ms cubic-bezier(.22,1,.36,1); }

    @keyframes ct-scan-sweep {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100%); }
    }
    .ct-scan-sweep {
      position: absolute; left: 0; right: 0; height: 40%;
      background: linear-gradient(180deg, transparent, rgba(5,150,105,0.18), transparent);
      animation: ct-scan-sweep 1.1s ease-in-out infinite;
    }

    .ct-ring-track { stroke: #EEF0EA; }

    .ct-focus:focus-visible {
      outline: 2px solid var(--cal-1);
      outline-offset: 2px;
    }

    .ct-btn-primary {
      background: var(--ink);
      color: #fff;
      transition: transform 160ms ease, background 160ms ease, box-shadow 160ms ease;
    }
    .ct-btn-primary:hover:not(:disabled) { background: #223328; box-shadow: 0 8px 20px -8px rgba(22,36,28,0.45); }
    .ct-btn-primary:active:not(:disabled) { transform: scale(0.98); }
    .ct-btn-primary:disabled { background: #C9CEC4; cursor: not-allowed; }

    .ct-input {
      background: #FBFCF9;
      border: 1px solid var(--border);
      transition: border-color 160ms ease, background 160ms ease, box-shadow 160ms ease;
    }
    .ct-input:focus {
      border-color: var(--cal-1);
      background: #fff;
      box-shadow: 0 0 0 3px rgba(5,150,105,0.12);
      outline: none;
    }

    .ct-tab {
      transition: background 180ms ease, color 180ms ease, box-shadow 180ms ease;
    }

    .ct-scrollbar-hide::-webkit-scrollbar { display: none; }
    .ct-scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

    .ct-row-enter { animation: ct-fade-in 280ms ease both; }

    .ct-dropzone {
      border: 2px dashed #CBD3C4;
      transition: border-color 180ms ease, background 180ms ease;
    }
    .ct-dropzone:hover { border-color: var(--cal-1); background: #F5FAF7; }
  `}</style>
);

/* ------------------------------------------------------------------ */
/*  Mock data                                                           */
/* ------------------------------------------------------------------ */

const GOALS = {
  loss: {
    label: "Weight Loss",
    calories: 1800,
    protein: 120,
    carbs: 180,
    fat: 60,
  },
  maintenance: {
    label: "Maintenance",
    calories: 2200,
    protein: 140,
    carbs: 250,
    fat: 70,
  },
  gain: {
    label: "Muscle Gain",
    calories: 2800,
    protein: 180,
    carbs: 320,
    fat: 80,
  },
};

// nutrition per 100g
const FOOD_DB = {
  rice: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  chicken: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  "chicken breast": { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  egg: { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
  banana: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  oats: { calories: 389, protein: 16.9, carbs: 66, fat: 6.9 },
  salmon: { calories: 208, protein: 20, carbs: 0, fat: 13 },
  broccoli: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  almonds: { calories: 579, protein: 21, carbs: 22, fat: 50 },
  yogurt: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
  bread: { calories: 265, protein: 9, carbs: 49, fat: 3.2 },
  apple: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  milk: { calories: 42, protein: 3.4, carbs: 5, fat: 1 },
  potato: { calories: 77, protein: 2, carbs: 17, fat: 0.1 },
  beef: { calories: 250, protein: 26, carbs: 0, fat: 17 },
  avocado: { calories: 160, protein: 2, carbs: 9, fat: 15 },
  "peanut butter": { calories: 588, protein: 25, carbs: 20, fat: 50 },
  quinoa: { calories: 120, protein: 4.4, carbs: 21, fat: 1.9 },
};

const FALLBACK_FOOD = { calories: 150, protein: 6, carbs: 18, fat: 5 };

const SCAN_RESULT = {
  name: "Grilled Chicken Breast",
  portion: 150,
};

const round = (n) => Math.round(n * 10) / 10;

function lookupFood(name) {
  const key = name.trim().toLowerCase();
  if (!key) return null;
  if (FOOD_DB[key]) return FOOD_DB[key];
  const match = Object.keys(FOOD_DB).find(
    (k) => k.includes(key) || key.includes(k)
  );
  return match ? FOOD_DB[match] : null;
}

function computeNutrition(name, portion) {
  const base = lookupFood(name) || FALLBACK_FOOD;
  const factor = portion / 100;
  return {
    calories: Math.round(base.calories * factor),
    protein: round(base.protein * factor),
    carbs: round(base.carbs * factor),
    fat: round(base.fat * factor),
    matched: !!lookupFood(name),
  };
}

let idCounter = 1;
const nextId = () => idCounter++;

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function GaugeBar({ percent, over, small }) {
  const clamped = Math.min(percent, 100);
  return (
    <div className={`ct-gauge ${small ? "ct-gauge-sm" : ""}`}>
      <div
        className={`ct-gauge-fill ${over ? "over" : ""}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

function RingGauge({ percent, color, trackColor, size = 84, stroke = 9 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(percent, 100);
  const offset = c - (clamped / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={trackColor}
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 700ms cubic-bezier(.22,1,.36,1)" }}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="ct-display"
        style={{ fontSize: size * 0.22, fontWeight: 700, fill: "var(--ink)" }}
      >
        {Math.round(clamped)}%
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Header                                                              */
/* ------------------------------------------------------------------ */

function Header() {
  const today = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    []
  );
  return (
    <header className="flex items-center justify-between py-5 px-1">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, var(--cal-1), var(--cal-2))" }}
        >
          <Flame size={20} color="#fff" strokeWidth={2.4} />
        </div>
        <div>
          <h1 className="ct-display text-lg sm:text-xl font-bold leading-tight">CalorieTrack</h1>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Daily Nutrition Dashboard</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <span className="hidden sm:block text-sm" style={{ color: "var(--muted)" }}>{today}</span>
        <button
          className="ct-focus w-9 h-9 rounded-full flex items-center justify-center ct-card-hover"
          style={{ border: "1px solid var(--border)", background: "#fff" }}
          aria-label="Settings"
        >
          <Settings size={16} style={{ color: "var(--muted)" }} />
        </button>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "var(--border-soft)" }}
        >
          <User size={16} style={{ color: "var(--muted)" }} />
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Fitness Goal Toggle                                                 */
/* ------------------------------------------------------------------ */

function FitnessGoalToggle({ selectedGoal, onChange }) {
  return (
    <div className="ct-card p-1.5 flex items-center gap-1 overflow-x-auto ct-scrollbar-hide">
      {Object.entries(GOALS).map(([key, g]) => {
        const active = key === selectedGoal;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="ct-tab ct-focus flex-1 min-w-[110px] px-4 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap"
            style={
              active
                ? { background: "var(--ink)", color: "#fff" }
                : { background: "transparent", color: "var(--muted)" }
            }
          >
            {g.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Calorie Budget Hero Card                                            */
/* ------------------------------------------------------------------ */

function CalorieBudgetCard({ totalCalories, target }) {
  const remaining = target - totalCalories;
  const over = remaining < 0;
  const percent = (totalCalories / target) * 100;

  return (
    <div className="ct-card p-6 sm:p-8 relative overflow-hidden">
      <div
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-[0.06] pointer-events-none"
        style={{ background: over ? "var(--over)" : "var(--cal-1)" }}
      />
      <div className="flex items-start justify-between flex-wrap gap-4 mb-5 relative">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--muted)" }}>
            Daily Calorie Budget
          </p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="ct-display text-4xl sm:text-5xl font-bold">
              {totalCalories.toLocaleString()}
            </span>
            <span className="text-lg sm:text-xl" style={{ color: "var(--muted)" }}>
              / {target.toLocaleString()} kcal
            </span>
          </div>
        </div>

        <div
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl text-sm font-semibold"
          style={{
            background: over ? "var(--over-soft)" : "#E7F5EE",
            color: over ? "var(--over)" : "var(--cal-1)",
          }}
        >
          {over ? <AlertTriangle size={16} /> : <Flame size={16} />}
          {over
            ? `${Math.abs(remaining).toLocaleString()} kcal over budget`
            : `${remaining.toLocaleString()} kcal remaining`}
        </div>
      </div>

      <GaugeBar percent={percent} over={over} />

      <div className="flex justify-between mt-2 text-xs" style={{ color: "var(--muted)" }}>
        <span>0</span>
        <span>{Math.round(percent)}% of goal</span>
        <span>{target.toLocaleString()}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Macro Cards                                                         */
/* ------------------------------------------------------------------ */

function MacroCard({ icon: Icon, label, consumed, target, unit, color, soft }) {
  const percent = target > 0 ? (consumed / target) * 100 : 0;
  return (
    <div className="ct-card ct-card-hover p-5 flex items-center gap-4">
      <RingGauge percent={percent} color={color} trackColor={soft} />
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <Icon size={14} style={{ color }} />
          <span className="text-xs font-semibold uppercase tracking-wide truncate" style={{ color: "var(--muted)" }}>
            {label}
          </span>
        </div>
        <p className="ct-display text-xl font-bold leading-none mb-2">
          {consumed}
          <span className="text-sm font-medium" style={{ color: "var(--muted)" }}> / {target}{unit}</span>
        </p>
        <GaugeBar percent={percent} small />
      </div>
    </div>
  );
}

function MacroCards({ totals, targets }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <MacroCard
        icon={Beef}
        label="Protein"
        consumed={totals.protein}
        target={targets.protein}
        unit="g"
        color="var(--protein)"
        soft="var(--protein-soft)"
      />
      <MacroCard
        icon={Wheat}
        label="Carbohydrates"
        consumed={totals.carbs}
        target={targets.carbs}
        unit="g"
        color="var(--carbs)"
        soft="var(--carbs-soft)"
      />
      <MacroCard
        icon={Droplet}
        label="Fats"
        consumed={totals.fat}
        target={targets.fat}
        unit="g"
        color="var(--fat)"
        soft="var(--fat-soft)"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Food Logger                                                         */
/* ------------------------------------------------------------------ */

function FoodLogger({ onAdd, onScan }) {
  const [name, setName] = useState("");
  const [portion, setPortion] = useState("");
  const [scanning, setScanning] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const canAdd = name.trim().length > 0 && Number(portion) > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    const matched = !!lookupFood(name);
    onAdd(name.trim(), Number(portion));
    setNotFound(!matched);
    setName("");
    setPortion("");
    setTimeout(() => setNotFound(false), 2600);
  };

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setName(SCAN_RESULT.name);
      setPortion(String(SCAN_RESULT.portion));
      onScan();
    }, 1600);
  };

  return (
    <div className="ct-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <UtensilsCrossed size={18} />
        <h2 className="ct-display text-lg font-bold">Log Food</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-3 mb-3">
        <div>
          <label htmlFor="ct-food-name" className="text-xs font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>
            Food Name
          </label>
          <input
            id="ct-food-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter food name..."
            className="ct-input ct-focus w-full rounded-xl px-3.5 py-2.5 text-sm"
          />
        </div>
        <div>
          <label htmlFor="ct-portion" className="text-xs font-semibold block mb-1.5" style={{ color: "var(--muted)" }}>
            Portion
          </label>
          <div className="relative">
            <input
              id="ct-portion"
              type="number"
              min="0"
              value={portion}
              onChange={(e) => setPortion(e.target.value)}
              placeholder="Weight in grams"
              className="ct-input ct-focus w-full rounded-xl pl-3.5 pr-8 py-2.5 text-sm"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold" style={{ color: "var(--muted)" }}>
              g
            </span>
          </div>
        </div>
      </div>

      {notFound && (
        <p className="text-xs mb-3 ct-fade-in" style={{ color: "var(--protein)" }}>
          We didn't recognize that food — using an estimated nutrition value.
        </p>
      )}

      <button
        onClick={handleAdd}
        disabled={!canAdd}
        className="ct-btn-primary ct-focus w-full rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 mb-6"
      >
        <Plus size={16} /> Add Food
      </button>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        <span className="text-xs font-medium" style={{ color: "var(--muted)" }}>or</span>
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
      </div>

      <button
        onClick={handleScan}
        disabled={scanning}
        className="ct-dropzone ct-focus w-full rounded-2xl py-7 px-4 flex flex-col items-center text-center gap-2 relative overflow-hidden"
      >
        {scanning && <div className="ct-scan-sweep" />}
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center mb-1"
          style={{ background: "var(--border-soft)" }}
        >
          {scanning ? (
            <Loader2 size={20} className="animate-spin" style={{ color: "var(--cal-1)" }} />
          ) : (
            <Camera size={20} style={{ color: "var(--muted)" }} />
          )}
        </div>
        <p className="text-sm font-semibold flex items-center gap-1.5">
          {scanning ? "Analyzing food..." : (
            <>
              <Sparkles size={14} style={{ color: "var(--cal-1)" }} /> Scan Food with AI
            </>
          )}
        </p>
        {!scanning && (
          <p className="text-xs max-w-[260px]" style={{ color: "var(--muted)" }}>
            Upload a food image to automatically estimate nutrition
          </p>
        )}
        {!scanning && (
          <span
            className="mt-2 text-xs font-semibold px-4 py-2 rounded-lg"
            style={{ background: "var(--ink)", color: "#fff" }}
          >
            Upload Image
          </span>
        )}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Daily Summary                                                       */
/* ------------------------------------------------------------------ */

function DailySummary({ remaining, mealsCount, proteinRemaining, goalLabel }) {
  const items = [
    { label: "Calories Remaining", value: `${remaining.toLocaleString()} kcal` },
    { label: "Meals Logged", value: mealsCount },
    { label: "Protein Remaining", value: `${proteinRemaining} g` },
    { label: "Goal", value: goalLabel },
  ];
  return (
    <div className="ct-card p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
      {items.map((it) => (
        <div key={it.label}>
          <p className="text-xs font-medium mb-1" style={{ color: "var(--muted)" }}>{it.label}</p>
          <p className="ct-display text-base font-bold truncate">{it.value}</p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Meal History                                                        */
/* ------------------------------------------------------------------ */

function EmptyState() {
  return (
    <div className="flex flex-col items-center text-center py-12 px-4">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "var(--border-soft)" }}
      >
        <UtensilsCrossed size={26} style={{ color: "var(--muted)" }} />
      </div>
      <p className="font-semibold mb-1">No meals logged yet</p>
      <p className="text-sm max-w-xs" style={{ color: "var(--muted)" }}>
        Start tracking your nutrition by adding your first meal.
      </p>
    </div>
  );
}

function MealItem({ meal, onDelete }) {
  return (
    <>
      {/* Desktop row */}
      <tr className="ct-row-enter hidden sm:table-row" style={{ borderBottom: "1px solid var(--border-soft)" }}>
        <td className="py-3.5 pr-3 font-medium text-sm">{meal.name}</td>
        <td className="py-3.5 px-3 text-sm" style={{ color: "var(--muted)" }}>{meal.portion}g</td>
        <td className="py-3.5 px-3 text-sm font-semibold">{meal.calories} kcal</td>
        <td className="py-3.5 px-3 text-sm" style={{ color: "var(--protein)" }}>{meal.protein}g</td>
        <td className="py-3.5 px-3 text-sm" style={{ color: "var(--carbs)" }}>{meal.carbs}g</td>
        <td className="py-3.5 px-3 text-sm" style={{ color: "var(--fat)" }}>{meal.fat}g</td>
        <td className="py-3.5 pl-3 text-right">
          <button
            onClick={() => onDelete(meal.id)}
            aria-label={`Delete ${meal.name}`}
            className="ct-focus w-8 h-8 rounded-lg flex items-center justify-center ml-auto"
            style={{ color: "var(--over)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--over-soft)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Trash2 size={15} />
          </button>
        </td>
      </tr>

      {/* Mobile card */}
      <tr className="sm:hidden">
        <td colSpan={7} className="py-0">
          <div className="ct-row-enter ct-card p-4 mb-3">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-sm">{meal.name}</p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>{meal.portion}g · {meal.calories} kcal</p>
              </div>
              <button
                onClick={() => onDelete(meal.id)}
                aria-label={`Delete ${meal.name}`}
                className="ct-focus w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ color: "var(--over)", background: "var(--over-soft)" }}
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="flex gap-4 text-xs font-medium">
              <span style={{ color: "var(--protein)" }}>P {meal.protein}g</span>
              <span style={{ color: "var(--carbs)" }}>C {meal.carbs}g</span>
              <span style={{ color: "var(--fat)" }}>F {meal.fat}g</span>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}

function MealHistory({ meals, onDelete }) {
  return (
    <div className="ct-card p-6">
      <h2 className="ct-display text-lg font-bold mb-4">Today's Food Log</h2>

      {meals.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="hidden sm:table-header-group">
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Food", "Portion", "Calories", "Protein", "Carbs", "Fat", ""].map((h) => (
                  <th
                    key={h}
                    className="text-left py-2 px-3 text-xs font-semibold uppercase tracking-wide first:pl-0"
                    style={{ color: "var(--muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {meals.map((meal) => (
                <MealItem key={meal.id} meal={meal} onDelete={onDelete} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Budget Exceeded Modal                                               */
/* ------------------------------------------------------------------ */

function BudgetExceededModal({ current, target, onClose }) {
  const over = current - target;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(22,36,28,0.45)" }}
      onClick={onClose}
    >
      <div
        className="ct-card ct-modal-pop w-full max-w-sm p-6 relative"
        style={{ borderColor: "var(--over-soft)" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ct-modal-title"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="ct-focus absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ color: "var(--muted)" }}
        >
          <X size={16} />
        </button>

        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "var(--over-soft)" }}
        >
          <AlertTriangle size={22} style={{ color: "var(--over)" }} />
        </div>

        <h3 id="ct-modal-title" className="ct-display text-xl font-bold mb-1.5">
          Daily Budget Exceeded!
        </h3>
        <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
          You've exceeded your daily calorie target by <strong style={{ color: "var(--over)" }}>{over} kcal</strong>.
        </p>

        <div className="rounded-xl p-4 mb-5 grid grid-cols-3 gap-2 text-center" style={{ background: "var(--bg)" }}>
          <div>
            <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Current</p>
            <p className="ct-display font-bold text-sm">{current}</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Target</p>
            <p className="ct-display font-bold text-sm">{target}</p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>Over by</p>
            <p className="ct-display font-bold text-sm" style={{ color: "var(--over)" }}>{over}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="ct-btn-primary ct-focus w-full rounded-xl py-3 text-sm font-semibold"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Toast                                                               */
/* ------------------------------------------------------------------ */

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-xs sm:max-w-sm">
      <div
        className="ct-toast ct-card flex items-center gap-2.5 px-4 py-3 shadow-lg"
        style={{ borderColor: "var(--border)" }}
      >
        <CheckCircle2 size={17} style={{ color: "var(--cal-1)" }} />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  App                                                                  */
/* ------------------------------------------------------------------ */

export default function App() {
  const [selectedGoal, setSelectedGoal] = useState("maintenance");
  const [meals, setMeals] = useState([]);
  const [showExceededModal, setShowExceededModal] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  const targets = GOALS[selectedGoal];

  const totals = useMemo(() => {
    return meals.reduce(
      (acc, m) => ({
        calories: acc.calories + m.calories,
        protein: round(acc.protein + m.protein),
        carbs: round(acc.carbs + m.carbs),
        fat: round(acc.fat + m.fat),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [meals]);

  const showToast = useCallback((msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(""), 2400);
  }, []);

  const handleAddFood = (name, portion) => {
    const nutrition = computeNutrition(name, portion);
    const wasUnder = totals.calories <= targets.calories;
    const newTotal = totals.calories + nutrition.calories;

    const meal = {
      id: nextId(),
      name,
      portion,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
    };
    setMeals((prev) => [meal, ...prev]);
    showToast(`${name} added to today's log`);

    if (wasUnder && newTotal > targets.calories) {
      setShowExceededModal(true);
    }
  };

  const handleDelete = (id) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  const remaining = targets.calories - totals.calories;
  const proteinRemaining = Math.max(0, round(targets.protein - totals.protein));

  return (
    <div className="ct-root min-h-screen">
      <GlobalStyle />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <Header />

        <main className="flex flex-col gap-5">
          <FitnessGoalToggle selectedGoal={selectedGoal} onChange={setSelectedGoal} />

          <CalorieBudgetCard totalCalories={totals.calories} target={targets.calories} />

          <MacroCards totals={totals} targets={targets} />

          <DailySummary
            remaining={remaining}
            mealsCount={meals.length}
            proteinRemaining={proteinRemaining}
            goalLabel={targets.label}
          />

          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-5 items-start">
            <FoodLogger onAdd={handleAddFood} onScan={() => showToast("Scan complete — review and add")} />
            <MealHistory meals={meals} onDelete={handleDelete} />
          </div>
        </main>
      </div>

      {showExceededModal && (
        <BudgetExceededModal
          current={totals.calories}
          target={targets.calories}
          onClose={() => setShowExceededModal(false)}
        />
      )}

      <Toast message={toast} />
    </div>
  );
}
