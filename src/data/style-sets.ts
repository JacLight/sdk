/**
 * Style Sets — one design system shape used by Build Studio, Creative Studio and the
 * message template editor: colours, a typography scale, corner radii, shadows,
 * spacing, and the default look of common elements.
 *
 * A design-time tool: pick a preset, adjust it, apply it — `compileStyleSet`
 * writes it as plain CSS into the item (a page's head, an email's HTML), and
 * from then on that CSS is the item's own. `styleSetFromCss` reads such CSS
 * back so it can be adjusted again. `compileStyleSet` turns a set into CSS
 * variables, role classes and base element rules (all under `:where()`, so an
 * element's own classes always win) plus the Google Fonts it needs.
 */

export interface StyleSetColor {
  name: string;
  hex: string;
  label?: string;
}

/** A type role's font. */
export interface StyleSetFont {
  role: string;
  family: string;
  size: number;
  weight: number;
  lineHeight: number;
  letterSpacing: number;
}

/** A named px value (corner radius, spacing). */
export interface StyleSetSize {
  name: string;
  px: number;
}

export interface StyleSetShadow {
  name: string;
  value: string;
}

/** How a common element looks by default. Colours, radii and shadows name the set's tokens (or a raw CSS value). */
export interface StyleSetElement {
  element: string;
  font?: string;
  background?: string;
  color?: string;
  border?: string;
  radius?: string;
  shadow?: string;
  padding?: string;
}

export interface StyleSetData {
  name: string;
  title?: string;
  description?: string;
  basedOn?: string;
  mode?: 'light' | 'dark';
  colors: StyleSetColor[];
  typography: StyleSetFont[];
  cornerRadius: StyleSetSize[];
  spacing: StyleSetSize[];
  shadows: StyleSetShadow[];
  elements: StyleSetElement[];
  builtIn?: boolean;
}

/** Look up a token in a set: styleSetToken(set.colors, 'primary'). */
export const styleSetToken = <T extends { name?: string; role?: string; element?: string }>(list: T[] | undefined, key: string | undefined): T | undefined =>
  key ? (list || []).find(t => (t.name ?? t.role ?? t.element) === key) : undefined;

/** Typography roles, in order. */
export const STYLE_SET_TYPE_ROLES = ['display', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'small', 'label', 'caption'] as const;
/** The elements a set styles by default, and the HTML they apply to. */
export const STYLE_SET_ELEMENTS: Record<string, { label: string; selector: string }> = {
  body: { label: 'Page', selector: 'body' },
  link: { label: 'Link', selector: 'a' },
  button: { label: 'Button', selector: 'button, .btn' },
  input: { label: 'Input', selector: 'input:not([type=checkbox]):not([type=radio]), select, textarea' },
  card: { label: 'Card', selector: '.card' },
  section: { label: 'Section', selector: 'section' },
};

const font = (role: string, family: string, size: number, weight: number, lineHeight: number, letterSpacing = 0): StyleSetFont => ({ role, family, size, weight, lineHeight, letterSpacing });

/** A complete set from a heading font, a body font and a palette — the built-ins are made this way. */
const make = (
  name: string,
  title: string,
  colors: Record<string, string>,
  heading: string,
  body: string,
  opts: { mode?: 'light' | 'dark'; headingWeight?: number; radius?: number } = {},
): StyleSetData => {
  const hw = opts.headingWeight ?? 700;
  const r = opts.radius ?? 8;
  const labels: Record<string, string> = { primary: 'Primary', secondary: 'Secondary', tertiary: 'Tertiary', neutral: 'Neutral', background: 'Background', surface: 'Surface', text: 'Text', muted: 'Muted', error: 'Error', success: 'Success' };
  return {
    name,
    title,
    mode: opts.mode || 'light',
    colors: Object.entries(colors).map(([name, hex]) => ({ name, hex, label: labels[name] || name })),
    typography: [
      font('display', heading, 56, hw, 64, -0.5),
      font('h1', heading, 40, hw, 48, -0.25),
      font('h2', heading, 32, hw, 40),
      font('h3', heading, 24, Math.max(500, hw - 100), 32),
      font('h4', body, 20, 600, 28),
      font('h5', body, 18, 600, 26),
      font('h6', body, 16, 600, 24),
      font('body', body, 16, 400, 24),
      font('small', body, 14, 400, 20),
      font('label', body, 12, 500, 16, 0.5),
      font('caption', body, 11, 400, 16, 0.4),
    ],
    cornerRadius: [
      { name: 'none', px: 0 },
      { name: 'sm', px: Math.round(r / 2) },
      { name: 'md', px: r },
      { name: 'lg', px: r * 2 },
      { name: 'full', px: 9999 },
    ],
    spacing: [
      { name: 'xs', px: 4 },
      { name: 'sm', px: 8 },
      { name: 'md', px: 16 },
      { name: 'lg', px: 24 },
      { name: 'xl', px: 32 },
      { name: 'xxl', px: 48 },
    ],
    shadows: [
      { name: 'none', value: 'none' },
      { name: 'sm', value: '0 1px 2px rgba(0,0,0,0.06)' },
      { name: 'md', value: '0 4px 12px rgba(0,0,0,0.08)' },
      { name: 'lg', value: '0 12px 32px rgba(0,0,0,0.12)' },
    ],
    elements: [
      { element: 'body', font: 'body', background: 'background', color: 'text' },
      { element: 'link', color: 'primary' },
      { element: 'button', font: 'label', background: 'primary', color: 'background', radius: 'md', padding: '10px 18px' },
      { element: 'input', font: 'body', background: 'background', color: 'text', border: 'secondary', radius: 'sm', padding: '8px 12px' },
      { element: 'card', background: 'surface', radius: 'lg', shadow: 'md', padding: '24px' },
      { element: 'section', padding: '64px 24px' },
    ],
    builtIn: true,
  };
};

export const BUILT_IN_STYLE_SETS: StyleSetData[] = [
  make('modern-minimal', 'Modern Minimal', { primary: '#111827', secondary: '#E5E7EB', tertiary: '#6366F1', neutral: '#F9FAFB', background: '#FFFFFF', surface: '#F9FAFB', text: '#111827', muted: '#6B7280', error: '#EF4444', success: '#10B981' }, 'Inter', 'Inter'),
  make('warm-earthy', 'Warm Earthy', { primary: '#333333', secondary: '#E5E1D8', tertiary: '#8A9A5B', neutral: '#F5F2ED', background: '#FEFCF9', surface: '#F5F2ED', text: '#2D2A26', muted: '#77716A', error: '#C53030', success: '#2F855A' }, 'Playfair Display', 'Lato'),
  make('bold-vibrant', 'Bold Vibrant', { primary: '#7C3AED', secondary: '#FCD34D', tertiary: '#EC4899', neutral: '#F5F3FF', background: '#FFFFFF', surface: '#FAF5FF', text: '#1F1235', muted: '#6B5B8A', error: '#EF4444', success: '#10B981' }, 'Poppins', 'Poppins', { headingWeight: 800, radius: 12 }),
  make('corporate-blue', 'Corporate Blue', { primary: '#1E40AF', secondary: '#DBEAFE', tertiary: '#0EA5E9', neutral: '#F1F5F9', background: '#FFFFFF', surface: '#F8FAFC', text: '#0F172A', muted: '#64748B', error: '#DC2626', success: '#16A34A' }, 'Roboto', 'Roboto', { headingWeight: 600, radius: 6 }),
  make('luxury-dark', 'Luxury Dark', { primary: '#D4AF37', secondary: '#2D2D44', tertiary: '#E8D5B7', neutral: '#2D2D44', background: '#0F0F1A', surface: '#1A1A2E', text: '#F5F0E6', muted: '#A8A29E', error: '#FF6B6B', success: '#51CF66' }, 'Cormorant Garamond', 'Montserrat', { mode: 'dark', headingWeight: 400, radius: 2 }),
  make('fresh-nature', 'Fresh Nature', { primary: '#065F46', secondary: '#D1FAE5', tertiary: '#F59E0B', neutral: '#ECFDF5', background: '#FFFFFF', surface: '#F0FDF4', text: '#052E24', muted: '#4B6358', error: '#DC2626', success: '#059669' }, 'DM Serif Display', 'DM Sans', { headingWeight: 400 }),
  make('soft-pastel', 'Soft Pastel', { primary: '#8B5CF6', secondary: '#FDE68A', tertiary: '#F9A8D4', neutral: '#FEF3C7', background: '#FFFBEB', surface: '#FEF9EE', text: '#3B2F4A', muted: '#7C6F8A', error: '#F87171', success: '#34D399' }, 'Nunito', 'Nunito', { headingWeight: 800, radius: 16 }),
  make('tech-startup', 'Tech Startup', { primary: '#0F172A', secondary: '#38BDF8', tertiary: '#A78BFA', neutral: '#F1F5F9', background: '#FFFFFF', surface: '#F8FAFC', text: '#0F172A', muted: '#64748B', error: '#EF4444', success: '#22C55E' }, 'Space Grotesk', 'Inter'),
  make('retro-warm', 'Retro Warm', { primary: '#B45309', secondary: '#FEF3C7', tertiary: '#DC2626', neutral: '#FFFBEB', background: '#FFFDF7', surface: '#FEF9EE', text: '#3B2712', muted: '#8A6A45', error: '#991B1B', success: '#166534' }, 'Abril Fatface', 'Source Sans 3', { headingWeight: 400, radius: 4 }),
  make('clean-mono', 'Clean Mono', { primary: '#18181B', secondary: '#E4E4E7', tertiary: '#A1A1AA', neutral: '#F4F4F5', background: '#FFFFFF', surface: '#FAFAFA', text: '#18181B', muted: '#71717A', error: '#DC2626', success: '#16A34A' }, 'JetBrains Mono', 'IBM Plex Sans', { radius: 0 }),
];

export const getBuiltInStyleSet = (name?: string) => BUILT_IN_STYLE_SETS.find(s => s.name === name);

const slug = (s: string) => String(s).replace(/[^a-zA-Z0-9-]/g, '-');
const px = (n: number) => `${Number(n) || 0}px`;
const SYSTEM_FONTS = /^(system-ui|sans-serif|serif|monospace|ui-|-apple-system|Arial|Helvetica|Georgia|Times|Courier)/i;

/** A role's font. */
const roleFont = (set: StyleSetData, role: string): StyleSetFont | undefined => styleSetToken(set.typography, role);

/** A token name (primary, md…) as its CSS variable; anything else is used as written. */
const tokenValue = (kind: 'color' | 'radius' | 'shadow', v: string | undefined, set: StyleSetData) => {
  if (!v) return undefined;
  if (kind === 'color' && styleSetToken(set.colors, v)) return `var(--color-${slug(v)})`;
  if (kind === 'radius' && styleSetToken(set.cornerRadius, v)) return `var(--radius-${slug(v)})`;
  if (kind === 'shadow' && styleSetToken(set.shadows, v)) return `var(--shadow-${slug(v)})`;
  return v;
};

/**
 * A set as CSS. Variables on :root (colours, radii, shadows, spacing, and each
 * type role's font/size/weight/line-height/letter-spacing); a `.text-<role>`
 * class per role; h1–h6 and the element defaults as `:where()` rules. `inline`
 * leaves the variables out and writes values directly (for email, where
 * clients ignore CSS variables).
 */
export function compileStyleSet(set: StyleSetData, opts: { inline?: boolean; scope?: string } = {}): { css: string; fontLinks: string[] } {
  const scope = opts.scope || ':root';
  const vars: string[] = [];
  for (const c of set.colors || []) vars.push(`--color-${slug(c.name)}: ${c.hex};`);
  for (const r of set.cornerRadius || []) vars.push(`--radius-${slug(r.name)}: ${px(r.px)};`);
  for (const sh of set.shadows || []) vars.push(`--shadow-${slug(sh.name)}: ${sh.value};`);
  for (const sp of set.spacing || []) vars.push(`--space-${slug(sp.name)}: ${px(sp.px)};`);
  const roles = STYLE_SET_TYPE_ROLES.filter(r => roleFont(set, r));
  for (const r of roles) {
    const f = roleFont(set, r)!;
    vars.push(`--font-${r}: '${f.family}', system-ui, sans-serif;`, `--text-${r}-size: ${px(f.size)};`, `--text-${r}-weight: ${f.weight};`, `--text-${r}-leading: ${px(f.lineHeight)};`, `--text-${r}-tracking: ${f.letterSpacing}px;`);
  }

  const inlineVal = (v: string) => {
    if (!opts.inline) return v;
    return v.replace(/var\(--([a-z]+)-([a-zA-Z0-9-]+)\)/g, (_m, kind, key) => {
      if (kind === 'color') return styleSetToken(set.colors, key)?.hex ?? _m;
      if (kind === 'radius') return styleSetToken(set.cornerRadius, key) ? px(styleSetToken(set.cornerRadius, key)!.px) : _m;
      if (kind === 'shadow') return styleSetToken(set.shadows, key)?.value ?? _m;
      return _m;
    });
  };
  const typeDecl = (r: string) => {
    const f = roleFont(set, r);
    if (!f) return '';
    return opts.inline
      ? `font-family: '${f.family}', system-ui, sans-serif; font-size: ${px(f.size)}; font-weight: ${f.weight}; line-height: ${px(f.lineHeight)}; letter-spacing: ${f.letterSpacing}px;`
      : `font-family: var(--font-${r}); font-size: var(--text-${r}-size); font-weight: var(--text-${r}-weight); line-height: var(--text-${r}-leading); letter-spacing: var(--text-${r}-tracking);`;
  };

  const rules: string[] = [];
  if (!opts.inline) rules.push(`${scope} { ${vars.join(' ')} }`);
  for (const r of roles) rules.push(`.text-${r} { ${typeDecl(r)} }`);
  for (const h of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) if (roleFont(set, h)) rules.push(`:where(${h}) { ${typeDecl(h)} }`);
  for (const e of set.elements || []) {
    const target = STYLE_SET_ELEMENTS[e?.element]?.selector;
    if (!target || !e) continue;
    const d: string[] = [];
    if (e.font && roleFont(set, e.font)) d.push(typeDecl(e.font));
    const bg = tokenValue('color', e.background, set);
    if (bg) d.push(`background-color: ${inlineVal(bg)};`);
    const color = tokenValue('color', e.color, set);
    if (color) d.push(`color: ${inlineVal(color)};`);
    const border = tokenValue('color', e.border, set);
    if (border) d.push(`border: 1px solid ${inlineVal(border)};`);
    const radius = tokenValue('radius', e.radius, set);
    if (radius) d.push(`border-radius: ${inlineVal(radius)};`);
    const shadow = tokenValue('shadow', e.shadow, set);
    if (shadow) d.push(`box-shadow: ${inlineVal(shadow)};`);
    if (e.padding) d.push(`padding: ${e.padding};`);
    if (d.length) rules.push(`:where(${target}) { ${d.join(' ')} }`);
  }

  const families = Array.from(new Set(roles.map(r => roleFont(set, r)!.family).filter(f => f && !SYSTEM_FONTS.test(f))));
  const weights = Array.from(new Set(roles.map(r => roleFont(set, r)!.weight))).sort((a, b) => a - b);
  const fontLinks = families.length
    ? [`https://fonts.googleapis.com/css2?${families.map(f => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@${weights.join(';')}`).join('&')}&display=swap`]
    : [];
  return { css: rules.join('\n'), fontLinks };
}

/**
 * Read a set back from CSS that compileStyleSet wrote (its :root variables), so
 * an item's CSS can be adjusted again. Element defaults are not variables, so
 * they come from `base` (the preset it is closest to).
 */
export function styleSetFromCss(css: string, base: StyleSetData): StyleSetData | undefined {
  const vars: Record<string, string> = {};
  const re = /--([a-zA-Z0-9-]+)\s*:\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css || ''))) vars[m[1]] = m[2].trim();
  const pick = (prefix: string) => Object.keys(vars).filter(k => k.startsWith(prefix)).map(k => ({ name: k.slice(prefix.length), value: vars[k] }));
  const colors = pick('color-');
  if (!colors.length) return undefined;
  const num = (v?: string) => (v === undefined ? undefined : parseFloat(v));
  const typography: StyleSetFont[] = STYLE_SET_TYPE_ROLES.filter(r => vars[`font-${r}`]).map(role => {
    const b = styleSetToken(base.typography, role);
    return {
      role,
      family: vars[`font-${role}`].split(',')[0].replace(/['"]/g, '').trim(),
      size: num(vars[`text-${role}-size`]) ?? b?.size ?? 16,
      weight: num(vars[`text-${role}-weight`]) ?? b?.weight ?? 400,
      lineHeight: num(vars[`text-${role}-leading`]) ?? b?.lineHeight ?? 24,
      letterSpacing: num(vars[`text-${role}-tracking`]) ?? b?.letterSpacing ?? 0,
    };
  });
  return {
    ...base,
    name: base.name,
    title: base.title,
    builtIn: false,
    colors: colors.map(c => ({ name: c.name, hex: c.value, label: styleSetToken(base.colors, c.name)?.label || c.name })),
    typography: typography.length ? typography : base.typography,
    cornerRadius: pick('radius-').map(r => ({ name: r.name, px: parseFloat(r.value) || 0 })),
    spacing: pick('space-').map(r => ({ name: r.name, px: parseFloat(r.value) || 0 })),
    shadows: pick('shadow-').map(r => ({ name: r.name, value: r.value })),
  };
}
