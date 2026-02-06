# 🎨 UI Design Specification

## Visual Layout

```
╔═══════════════════════════════════════════════════════════════════╗
║                   FACE AUTHENTICATION                             ║
║                   ═══════════════════                             ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║     ┌─────────────────────────────────┐                         ║
║     │  [VERIFICATION] [REGISTRATION]  │  ← Mode Toggle          ║
║     └─────────────────────────────────┘                         ║
║                                                                   ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  ┌────────────────────────┐   ┌───────────────────────────────┐ ║
║  │                        │   │                               │ ║
║  │   ┏━━━━━━━━━━━━━━┓    │   │  REGISTER NEW USER            │ ║
║  │   ┃              ┃    │   │                               │ ║
║  │   ┃              ┃    │   │  User Identifier:             │ ║
║  │   ┃   WEBCAM     ┃    │   │  ┌─────────────────────────┐ │ ║
║  │   ┃   STREAM     ┃    │   │  │ USER_001              │ │ ║
║  │   ┃              ┃    │   │  └─────────────────────────┘ │ ║
║  │   ┃  [SCANNING]  ┃    │   │                               │ ║
║  │   ┃      ═══      ┃    │   │  [Progress Bar: 45%]          │ ║
║  │   ┃              ┃    │   │  ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░      │ ║
║  │   ┃              ┃    │   │                               │ ║
║  │   ┗━━━━━━━━━━━━━━┛    │   │  ┌─────────────────────────┐ │ ║
║  │   ● CAMERA ACTIVE     │   │  │  CAPTURE & SAVE         │ │ ║
║  │                        │   │  └─────────────────────────┘ │ ║
║  └────────────────────────┘   └───────────────────────────────┘ ║
║                                                                   ║
║                     [✓ Registration successful!]                 ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

## Color Palette

### Primary Colors
```css
/* Background Gradients */
background: linear-gradient(to-br, #111827, #000000, #111827);

/* Verification Mode (Blue/Cyan) */
--verify-primary: #3B82F6;     /* Blue 500 */
--verify-secondary: #06B6D4;   /* Cyan 500 */
--verify-glow: rgba(59, 130, 246, 0.5);

/* Registration Mode (Purple/Pink) */
--register-primary: #A855F7;   /* Purple 500 */
--register-secondary: #EC4899; /* Pink 500 */
--register-glow: rgba(168, 85, 247, 0.5);

/* Success State (Green) */
--success-color: #10B981;      /* Green 400 */
--success-glow: rgba(16, 185, 129, 0.5);

/* UI Elements */
--border-color: #374151;       /* Gray 700 */
--bg-panel: rgba(31, 41, 55, 0.5); /* Gray 800/50 */
--text-primary: #FFFFFF;
--text-secondary: #9CA3AF;     /* Gray 400 */
```

## Component Breakdown

### 1. Header Section
```
┌─────────────────────────────────┐
│   FACE AUTHENTICATION           │  ← 5xl font, bold, white
│   ═══════════════════           │  ← 1px gradient line (blue→cyan)
└─────────────────────────────────┘
```

### 2. Mode Toggle
```
┌───────────────────────────────────────┐
│  ┌─────────────────────────────────┐  │
│  │ [●] VERIFICATION  REGISTRATION  │  │  ← Active: gradient background
│  └─────────────────────────────────┘  │  ← Inactive: gray text
└───────────────────────────────────────┘
```

### 3. Camera Feed (Verification Mode)
```
┌────────────────────────────────────┐
│ ╔═╗                            ╔═╗ │  ← Corner brackets (cyan)
│ ║ ║                            ║ ║ │
│ ║ ║     ┌──────────────┐       ║ ║ │
│ ║ ║     │ ● SCANNING... │       ║ ║ │  ← Status badge (blue bg)
│ ║ ║     └──────────────┘       ║ ║ │
│ ║ ║                            ║ ║ │
│ ║ ║        [WEBCAM]            ║ ║ │
│ ║ ║                            ║ ║ │
│ ║ ║     ═══════════════        ║ ║ │  ← Scanning laser (animated)
│ ║ ║                            ║ ║ │
│ ║ ║                            ║ ║ │
│ ╚═╝                            ╚═╝ │
│                                    │
│  ● CAMERA ACTIVE                   │  ← Green dot (pulsing)
└────────────────────────────────────┘
```

### 4. Camera Feed (Match Found)
```
┌────────────────────────────────────┐
│ ╔═╗                            ╔═╗ │  ← GREEN brackets
│ ║ ║                            ║ ║ │
│ ║ ║     ┌──────────────┐       ║ ║ │
│ ║ ║     │ ✓ MATCH FOUND │       ║ ║ │  ← Green badge
│ ║ ║     └──────────────┘       ║ ║ │
│ ║ ║                            ║ ║ │
│ ║ ║        [WEBCAM]            ║ ║ │
│ ║ ║                            ║ ║ │
│ ║ ║                            ║ ║ │
│ ║ ║     [GREEN OVERLAY]        ║ ║ │  ← Success state
│ ║ ║                            ║ ║ │
│ ╚═╝                            ╚═╝ │
└────────────────────────────────────┘
```

### 5. Registration Panel
```
┌───────────────────────────────────┐
│  REGISTER NEW USER                │  ← 3xl font
│                                   │
│  USER IDENTIFIER                  │  ← Label (gray 400)
│  ┌─────────────────────────────┐  │
│  │ USER_001                  │  │  ← Input field
│  └─────────────────────────────┘  │
│                                   │
│  Uploading Face Data...      45%  │  ← Progress label
│  ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░      │  ← Progress bar
│                                   │
│  ┌─────────────────────────────┐  │
│  │    CAPTURE & SAVE           │  │  ← Purple→Pink gradient
│  └─────────────────────────────┘  │
└───────────────────────────────────┘
```

### 6. Verification Panel
```
┌───────────────────────────────────┐
│  FACE VERIFICATION                │  ← 3xl font
│                                   │
│  ┌─────────────────────────────┐  │
│  │ Status        ● SCANNING    │  │  ← Status box (dark bg)
│  │                             │  │
│  │ Continuously scanning for   │  │  ← Info text
│  │ registered faces...         │  │
│  └─────────────────────────────┘  │
│                                   │
│  ┌─────────────────────────────┐  │
│  │ 💡 The system automatically │  │  ← Info banner (blue bg)
│  │    scans every 2 seconds    │  │
│  └─────────────────────────────┘  │
└───────────────────────────────────┘
```

### 7. Toast Notification
```
┌───────────────────────────────────┐
│  ✓ Registration successful!       │  ← Green bg, green border
│    Welcome, USER_001              │     (auto-dismiss 5s)
└───────────────────────────────────┘

┌───────────────────────────────────┐
│  ✗ No face detected in image      │  ← Red bg, red border
└───────────────────────────────────┘

┌───────────────────────────────────┐
│  ℹ Processing your request...     │  ← Blue bg, blue border
└───────────────────────────────────┘
```

## Animation Specifications

### 1. Scanning Laser
```javascript
{
  initial: { top: '0%' },
  animate: { top: '100%' },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: 'linear'
  }
}
```
- **Color**: Blue (#3B82F6) during scan
- **Color**: Green (#10B981) when match found
- **Height**: 1px line + 8px blur effect
- **Shadow**: Glowing effect matching color

### 2. Progress Bar
```javascript
{
  initial: { width: 0 },
  animate: { width: `${uploadProgress}%` },
  transition: { duration: 0.3 }
}
```
- **Background**: Purple→Pink gradient
- **Height**: 8px
- **Border Radius**: Full (rounded)

### 3. Toast Notification
```javascript
{
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
  transition: { duration: 0.3 }
}
```
- **Position**: Fixed bottom center
- **Duration**: 5 seconds
- **Backdrop**: Blur effect

### 4. Mode Toggle
```javascript
{
  transition: { duration: 0.3 }
}
```
- **Active**: Scale 1.0, gradient background, shadow
- **Inactive**: Scale 1.0, gray text, no shadow

### 5. Status Indicator Pulse
```javascript
{
  animate: {
    scale: isScanning ? [1, 1.2, 1] : 1
  },
  transition: {
    duration: 1,
    repeat: Infinity
  }
}
```
- **Color**: Blue (scanning) or Green (match)
- **Size**: 12px circle

## Responsive Breakpoints

```css
/* Mobile: < 768px */
grid-template-columns: 1fr;
/* Stack camera and controls vertically */

/* Tablet: 768px - 1024px */
grid-template-columns: 1fr;
/* Stack but with larger components */

/* Desktop: > 1024px */
grid-template-columns: 1fr 1fr;
/* Side-by-side layout */
```

## Accessibility Features

1. **Keyboard Navigation**: All buttons focusable with Tab
2. **Screen Reader Labels**: aria-label on interactive elements
3. **Color Contrast**: WCAG AA compliant
4. **Focus Indicators**: Visible outline on focused elements
5. **Loading States**: Clear feedback during processing

## Typography

```css
/* Headings */
h1: 3rem (48px), font-weight: 700, tracking: wider
h2: 1.875rem (30px), font-weight: 700

/* Body */
body: 1rem (16px), font-weight: 400
small: 0.875rem (14px)

/* Labels */
label: 0.875rem (14px), uppercase, tracking: wider, font-weight: 500

/* Buttons */
button: 0.875rem (14px), uppercase, tracking: wider, font-weight: 700
```

## Shadow & Glow Effects

```css
/* Card Shadow */
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* Button Glow (Blue) */
box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);

/* Button Glow (Purple) */
box-shadow: 0 10px 15px -3px rgba(168, 85, 247, 0.3);

/* Success Overlay */
box-shadow: inset 0 0 0 4px rgba(16, 185, 129, 1);

/* Backdrop Blur */
backdrop-filter: blur(12px);
```

## Corner Bracket Specifications

```css
/* Each bracket is 64px × 64px */
.corner {
  width: 4rem;
  height: 4rem;
  border-width: 4px;
  border-color: #06B6D4; /* Cyan 500 */
}

/* Top-left */
border-left, border-top, border-radius: top-left

/* Top-right */
border-right, border-top, border-radius: top-right

/* Bottom-left */
border-left, border-bottom, border-radius: bottom-left

/* Bottom-right */
border-right, border-bottom, border-radius: bottom-right
```

## State Transitions

| State | Color | Animation | Duration |
|-------|-------|-----------|----------|
| Idle | Gray | None | - |
| Scanning | Blue | Laser sweep | 2s loop |
| Processing | Purple | Progress bar | Variable |
| Success | Green | Flash + hold | 3s |
| Error | Red | Shake | 0.5s |

---

**Design Philosophy**: Cinematic sci-fi aesthetic inspired by high-tech security systems in movies, without the typical "AI robot" look. Clean, professional, and futuristic.
