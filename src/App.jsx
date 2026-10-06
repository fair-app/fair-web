import { useEffect, useRef, useState } from 'react'
import './App.css'

/* Common dialing codes — flag, ISO code, dial code, name */
/* ISO 3166-1 alpha-2 code -> flag emoji (regional indicator symbols) */
function flagOf(iso) {
  return iso.toUpperCase().replace(/./g, (ch) =>
    String.fromCodePoint(ch.charCodeAt(0) + 127397)
  )
}

/* Nearly every dialing code, [iso, dial, name] — sorted by name */
const countryData = [
  ['AF', '+93', 'Afghanistan'], ['AL', '+355', 'Albania'], ['DZ', '+213', 'Algeria'],
  ['AS', '+1', 'American Samoa'], ['AD', '+376', 'Andorra'], ['AO', '+244', 'Angola'],
  ['AI', '+1', 'Anguilla'], ['AG', '+1', 'Antigua and Barbuda'], ['AR', '+54', 'Argentina'],
  ['AM', '+374', 'Armenia'], ['AW', '+297', 'Aruba'], ['AU', '+61', 'Australia'],
  ['AT', '+43', 'Austria'], ['AZ', '+994', 'Azerbaijan'], ['BS', '+1', 'Bahamas'],
  ['BH', '+973', 'Bahrain'], ['BD', '+880', 'Bangladesh'], ['BB', '+1', 'Barbados'],
  ['BY', '+375', 'Belarus'], ['BE', '+32', 'Belgium'], ['BZ', '+501', 'Belize'],
  ['BJ', '+229', 'Benin'], ['BM', '+1', 'Bermuda'], ['BT', '+975', 'Bhutan'],
  ['BO', '+591', 'Bolivia'], ['BA', '+387', 'Bosnia and Herzegovina'], ['BW', '+267', 'Botswana'],
  ['BR', '+55', 'Brazil'], ['BN', '+673', 'Brunei'], ['BG', '+359', 'Bulgaria'],
  ['BF', '+226', 'Burkina Faso'], ['BI', '+257', 'Burundi'], ['KH', '+855', 'Cambodia'],
  ['CM', '+237', 'Cameroon'], ['CA', '+1', 'Canada'], ['CV', '+238', 'Cape Verde'],
  ['KY', '+1', 'Cayman Islands'], ['CF', '+236', 'Central African Republic'], ['TD', '+235', 'Chad'],
  ['CL', '+56', 'Chile'], ['CN', '+86', 'China'], ['CO', '+57', 'Colombia'],
  ['KM', '+269', 'Comoros'], ['CG', '+242', 'Congo'], ['CD', '+243', 'Congo (DRC)'],
  ['CR', '+506', 'Costa Rica'], ['HR', '+385', 'Croatia'], ['CU', '+53', 'Cuba'],
  ['CY', '+357', 'Cyprus'], ['CZ', '+420', 'Czech Republic'], ['DK', '+45', 'Denmark'],
  ['DJ', '+253', 'Djibouti'], ['DM', '+1', 'Dominica'], ['DO', '+1', 'Dominican Republic'],
  ['EC', '+593', 'Ecuador'], ['EG', '+20', 'Egypt'], ['SV', '+503', 'El Salvador'],
  ['GQ', '+240', 'Equatorial Guinea'], ['ER', '+291', 'Eritrea'], ['EE', '+372', 'Estonia'],
  ['SZ', '+268', 'Eswatini'], ['ET', '+251', 'Ethiopia'], ['FJ', '+679', 'Fiji'],
  ['FI', '+358', 'Finland'], ['FR', '+33', 'France'], ['GA', '+241', 'Gabon'],
  ['GM', '+220', 'Gambia'], ['GE', '+995', 'Georgia'], ['DE', '+49', 'Germany'],
  ['GH', '+233', 'Ghana'], ['GI', '+350', 'Gibraltar'], ['GR', '+30', 'Greece'],
  ['GL', '+299', 'Greenland'], ['GD', '+1', 'Grenada'], ['GU', '+1', 'Guam'],
  ['GT', '+502', 'Guatemala'], ['GG', '+44', 'Guernsey'], ['GN', '+224', 'Guinea'],
  ['GW', '+245', 'Guinea-Bissau'], ['GY', '+592', 'Guyana'], ['HT', '+509', 'Haiti'],
  ['HN', '+504', 'Honduras'], ['HK', '+852', 'Hong Kong'], ['HU', '+36', 'Hungary'],
  ['IS', '+354', 'Iceland'], ['IN', '+91', 'India'], ['ID', '+62', 'Indonesia'],
  ['IR', '+98', 'Iran'], ['IQ', '+964', 'Iraq'], ['IE', '+353', 'Ireland'],
  ['IM', '+44', 'Isle of Man'], ['IL', '+972', 'Israel'], ['IT', '+39', 'Italy'],
  ['JM', '+1', 'Jamaica'], ['JP', '+81', 'Japan'], ['JE', '+44', 'Jersey'],
  ['JO', '+962', 'Jordan'], ['KZ', '+7', 'Kazakhstan'], ['KE', '+254', 'Kenya'],
  ['KI', '+686', 'Kiribati'], ['KW', '+965', 'Kuwait'], ['KG', '+996', 'Kyrgyzstan'],
  ['LA', '+856', 'Laos'], ['LV', '+371', 'Latvia'], ['LB', '+961', 'Lebanon'],
  ['LS', '+266', 'Lesotho'], ['LR', '+231', 'Liberia'], ['LY', '+218', 'Libya'],
  ['LI', '+423', 'Liechtenstein'], ['LT', '+370', 'Lithuania'], ['LU', '+352', 'Luxembourg'],
  ['MO', '+853', 'Macau'], ['MG', '+261', 'Madagascar'], ['MW', '+265', 'Malawi'],
  ['MY', '+60', 'Malaysia'], ['MV', '+960', 'Maldives'], ['ML', '+223', 'Mali'],
  ['MT', '+356', 'Malta'], ['MH', '+692', 'Marshall Islands'], ['MR', '+222', 'Mauritania'],
  ['MU', '+230', 'Mauritius'], ['MX', '+52', 'Mexico'], ['FM', '+691', 'Micronesia'],
  ['MD', '+373', 'Moldova'], ['MC', '+377', 'Monaco'], ['MN', '+976', 'Mongolia'],
  ['ME', '+382', 'Montenegro'], ['MA', '+212', 'Morocco'], ['MZ', '+258', 'Mozambique'],
  ['MM', '+95', 'Myanmar'], ['NA', '+264', 'Namibia'], ['NR', '+674', 'Nauru'],
  ['NP', '+977', 'Nepal'], ['NL', '+31', 'Netherlands'], ['NZ', '+64', 'New Zealand'],
  ['NI', '+505', 'Nicaragua'], ['NE', '+227', 'Niger'], ['NG', '+234', 'Nigeria'],
  ['KP', '+850', 'North Korea'], ['MK', '+389', 'North Macedonia'], ['NO', '+47', 'Norway'],
  ['OM', '+968', 'Oman'], ['PK', '+92', 'Pakistan'], ['PW', '+680', 'Palau'],
  ['PS', '+970', 'Palestine'], ['PA', '+507', 'Panama'], ['PG', '+675', 'Papua New Guinea'],
  ['PY', '+595', 'Paraguay'], ['PE', '+51', 'Peru'], ['PH', '+63', 'Philippines'],
  ['PL', '+48', 'Poland'], ['PT', '+351', 'Portugal'], ['PR', '+1', 'Puerto Rico'],
  ['QA', '+974', 'Qatar'], ['RO', '+40', 'Romania'], ['RU', '+7', 'Russia'],
  ['RW', '+250', 'Rwanda'], ['KN', '+1', 'Saint Kitts and Nevis'], ['LC', '+1', 'Saint Lucia'],
  ['VC', '+1', 'Saint Vincent and the Grenadines'], ['WS', '+685', 'Samoa'], ['SM', '+378', 'San Marino'],
  ['ST', '+239', 'Sao Tome and Principe'], ['SA', '+966', 'Saudi Arabia'], ['SN', '+221', 'Senegal'],
  ['RS', '+381', 'Serbia'], ['SC', '+248', 'Seychelles'], ['SL', '+232', 'Sierra Leone'],
  ['SG', '+65', 'Singapore'], ['SK', '+421', 'Slovakia'], ['SI', '+386', 'Slovenia'],
  ['SB', '+677', 'Solomon Islands'], ['SO', '+252', 'Somalia'], ['ZA', '+27', 'South Africa'],
  ['KR', '+82', 'South Korea'], ['SS', '+211', 'South Sudan'], ['ES', '+34', 'Spain'],
  ['LK', '+94', 'Sri Lanka'], ['SD', '+249', 'Sudan'], ['SR', '+597', 'Suriname'],
  ['SE', '+46', 'Sweden'], ['CH', '+41', 'Switzerland'], ['SY', '+963', 'Syria'],
  ['TW', '+886', 'Taiwan'], ['TJ', '+992', 'Tajikistan'], ['TZ', '+255', 'Tanzania'],
  ['TH', '+66', 'Thailand'], ['TL', '+670', 'Timor-Leste'], ['TG', '+228', 'Togo'],
  ['TO', '+676', 'Tonga'], ['TT', '+1', 'Trinidad and Tobago'], ['TN', '+216', 'Tunisia'],
  ['TR', '+90', 'Turkey'], ['TM', '+993', 'Turkmenistan'], ['TV', '+688', 'Tuvalu'],
  ['UG', '+256', 'Uganda'], ['UA', '+380', 'Ukraine'], ['AE', '+971', 'United Arab Emirates'],
  ['GB', '+44', 'United Kingdom'], ['US', '+1', 'United States'], ['UY', '+598', 'Uruguay'],
  ['UZ', '+998', 'Uzbekistan'], ['VU', '+678', 'Vanuatu'], ['VA', '+39', 'Vatican City'],
  ['VE', '+58', 'Venezuela'], ['VN', '+84', 'Vietnam'], ['YE', '+967', 'Yemen'],
  ['ZM', '+260', 'Zambia'], ['ZW', '+263', 'Zimbabwe'],
]

const countries = countryData.map(([iso, dial, name]) => ({
  iso, dial, name, flag: flagOf(iso),
}))

/* Searchable country-code dropdown */
function CountrySelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const boxRef = useRef(null)
  const searchRef = useRef(null)

  const selected = countries.find((c) => c.iso === value) ?? countries[0]
  const filtered = countries.filter((c) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return c.name.toLowerCase().includes(q) || c.dial.includes(q)
  })

  useEffect(() => {
    if (!open) return
    const onDocClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  useEffect(() => {
    if (open) searchRef.current?.focus()
    else setQuery('')
  }, [open])

  const pick = (iso) => {
    onChange(iso)
    setOpen(false)
  }

  return (
    <div className="country-select" ref={boxRef}>
      <button
        type="button"
        className="country-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected.flag} {selected.dial}</span>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="country-panel" role="listbox">
          <input
            ref={searchRef}
            type="text"
            className="country-search"
            placeholder="Search country or code"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ul className="country-list">
            {filtered.length === 0 && <li className="country-empty">No matches</li>}
            {filtered.map((c) => (
              <li key={c.iso}>
                <button
                  type="button"
                  className={c.iso === value ? 'is-active' : ''}
                  onClick={() => pick(c.iso)}
                  role="option"
                  aria-selected={c.iso === value}
                >
                  <span className="flag">{c.flag}</span>
                  <span className="name">{c.name}</span>
                  <span className="dial">{c.dial}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

/* Square placeholders — swap each one for a real SVG later. */
function Placeholder({ size = 'md', label = 'SVG' }) {
  return (
    <div className={`ph ph-${size}`} role="img" aria-label={`${label} placeholder`}>
      <span>{label}</span>
    </div>
  )
}

/* Brand mark — a bold "F" badge used in the nav and footer */
function BrandIcon() {
  return (
    <span className="brand-icon" aria-hidden="true">F</span>
  )
}

/* Why Fair icons */
function IconWallet() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h11A2.5 2.5 0 0 1 19 7.5V8H5.5A2.5 2.5 0 0 1 3 5.5" />
      <rect x="3" y="8" width="18" height="11" rx="2.5" />
      <path d="M15.5 13.5h2" />
    </svg>
  )
}
function IconTag() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11.5 11.5 3H18a3 3 0 0 1 3 3v6.5l-8.5 8.5a1.5 1.5 0 0 1-2 0L3 13.5a1.5 1.5 0 0 1 0-2Z" />
      <circle cx="15.5" cy="8.5" r="1.5" />
    </svg>
  )
}
function IconPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  )
}
function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 5 5.5v5.3C5 16 8 19 12 21c4-2 7-5 7-10.2V5.5Z" />
      <path d="m9.25 12 2 2 3.5-3.8" />
    </svg>
  )
}

/* How it works icons */
function IconRoute() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5.5" cy="6" r="2" />
      <circle cx="18.5" cy="18" r="2" />
      <path d="M7 7.3C8.5 10 11 10 13 11.5s2 3.2 3.5 5" strokeDasharray="2.6 2.6" />
    </svg>
  )
}
function IconCar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16v-3.2a2 2 0 0 1 .4-1.2l1.8-2.4a2 2 0 0 1 1.6-.8h8.4a2 2 0 0 1 1.6.8l1.8 2.4a2 2 0 0 1 .4 1.2V16" />
      <path d="M4 16a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 16" />
      <circle cx="7.5" cy="16" r="1.4" />
      <circle cx="16.5" cy="16" r="1.4" />
      <path d="M4 12.5h16" />
    </svg>
  )
}
function IconEuro() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 7.5a6.5 6.5 0 1 0 0 9" />
      <path d="M4.5 10h10M4.5 14h10" />
    </svg>
  )
}

const promises = [
  {
    Icon: IconWallet,
    title: 'You keep the fare',
    body: 'No commission, no cut. The fare you earn is the fare you keep.',
  },
  {
    Icon: IconTag,
    title: 'Fares you can predict',
    body: 'Know the price upfront. No surge, no surprises.',
  },
  {
    Icon: IconPin,
    title: 'Matched in seconds',
    body: 'Nearby drivers, quick pickups.',
  },
  {
    Icon: IconShield,
    title: 'Safe both ways',
    body: 'Verified drivers. Safety for riders and drivers alike.',
  },
]

const steps = [
  {
    Icon: IconRoute,
    k: '01',
    title: 'Tell us where you’re headed',
    body: 'Drop a pin or type the landmark. Fair shows the exact fare and the drivers nearby before you commit to anything.',
  },
  {
    Icon: IconCar,
    k: '02',
    title: 'A driver accepts directly',
    body: 'No middle layer deciding who gets your trip. Drivers see the ride, choose it, and you watch them come to you on the map.',
  },
  {
    Icon: IconEuro,
    k: '03',
    title: 'Pay the number you were shown',
    body: 'Cash or card, straight to the driver. The receipt matches the estimate, and nothing is quietly skimmed in between.',
  },
]

/* Web3Forms public access key — safe to ship in the client */
const WEB3FORMS_KEY = '6bdc2f4f-07f5-4fd4-b5ed-f3c1335df3b3'

export default function App() {
  const [form, setForm] = useState({ name: '', mobile: '', email: '' })
  const [status, setStatus] = useState('') // '' | 'sending' | 'success' | 'error'
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  const [countryIso, setCountryIso] = useState('DE')

  useEffect(() => {
    // Best-effort country detection from the browser — falls back to Germany silently.
    let cancelled = false

    const fromLocale = () => {
      try {
        const region = new Intl.Locale(navigator.language).maximize().region
        if (region && countries.some((c) => c.iso === region)) return region
      } catch {
        /* Intl.Locale not supported — ignore */
      }
      return null
    }

    const locale = fromLocale()
    if (locale) setCountryIso(locale)

    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        const match = countries.find((c) => c.iso === data.country_code)
        if (match) setCountryIso(match.iso)
      })
      .catch(() => {
        /* offline or blocked — keep the locale guess / default */
      })

    return () => { cancelled = true }
  }, [])

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    setStatus('')
  }

  const submit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    const formData = new FormData(e.target)
    const country = countries.find((c) => c.iso === countryIso)
    formData.append('access_key', WEB3FORMS_KEY)
    formData.append('subject', 'New driver registration - Fair')
    formData.append('country', `${country.name} (${country.dial})`)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      setStatus(data.success ? 'success' : 'error')
      if (data.success) setForm({ name: '', mobile: '', email: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <header className="nav">
        <div className="shell nav-in">
          <a className="brand" href="#top">
            <BrandIcon />
            <span>Fair</span>
          </a>
          <nav className="nav-links">
            <a href="#why">Why Fair</a>
            <a href="#how">How it works</a>
            <a href="#register">Drive with us</a>
          </nav>
          <a className="btn btn-dark" href="#register">Register now</a>
          <button
            type="button"
            className={`nav-toggle${menuOpen ? ' is-open' : ''}`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        {menuOpen && (
          <nav className="nav-mobile">
            <a href="#why" onClick={closeMenu}>Why Fair</a>
            <a href="#how" onClick={closeMenu}>How it works</a>
            <a href="#register" onClick={closeMenu}>Drive with us</a>
            <a className="btn btn-dark" href="#register" onClick={closeMenu}>Register now</a>
          </nav>
        )}
      </header>

      {/* 1 — Hero */}
      <section className="hero" id="top">
        <div className="shell hero-in">
          <div className="hero-copy">
            <span className="eyebrow">For riders</span>
            <h1>
              Book a ride with
              <br />
              <span className="hl">Zero Commission</span>
            </h1>
            <p>
              Fair is a direct line between the person who needs a ride and the person
              driving it. No commission is taken out of the fare.
            </p>
            <div className="hero-cta">
              <a className="btn btn-yellow" href="#register">Register now</a>
              <a className="btn btn-ghost" href="#why">See how it works</a>
            </div>
            <div className="hero-stats">
              <div><strong>0%</strong><span>taken from any fare</span></div>
              <div><strong>1.9 min</strong><span>average pickup wait</span></div>
              <div><strong>24/7</strong><span>support on both sides</span></div>
            </div>
          </div>
          <div className="hero-art">
            <img src="/imgs/heros.svg" alt="A driver and a rider with a cab" />
          </div>
        </div>
      </section>

      {/* 2 — Why Fair */}
      <section className="why" id="why">
        <div className="shell">
          <div className="section-head">
            <span className="eyebrow">Pricing</span>
            <h2>You pay less.</h2>
            <p>
              Most apps earn by standing between you and your driver. Fair earns nothing
              from the trip itself, so riders pay a smaller fare and drivers earn more
              from the exact same trip.
            </p>
          </div>
          <div className="grid-4">
            {promises.map((p) => (
              <article className="card" key={p.title}>
                <div className="card-icon"><p.Icon /></div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — How it works */}
      <section className="how" id="how">
        <div className="shell">
          <div className="section-head">
            <span className="eyebrow">How it works</span>
            <h2>Easy and Safe Rides</h2>
            <p>
              The whole trip is visible end to end - what it costs, who is driving, and
              exactly where the money goes when you step out.
            </p>
          </div>
          <div className="grid-3">
            {steps.map((s) => (
              <article className="step" key={s.k}>
                <span className="step-k">{s.k}</span>
                <div className="step-icon"><s.Icon /></div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Register */}
      <section className="reg" id="register">
        <div className="shell reg-in">
          <div className="reg-copy">
            <span className="eyebrow">For drivers</span>
            <h2>Register now and keep every euro you earn.</h2>
            <p>
              Leave your details and our onboarding team calls you back within a working
              day. Bring your licence, vehicle papers and permit - that is the whole list.
            </p>
            <img className="reg-art" src="/imgs/taxi-img2.svg" alt="A taxi on the way to pick up a rider" />
          </div>

          <form className="reg-form" onSubmit={submit}>
            <h3>Driver registration</h3>
            <label>
              Full name
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={update('name')}
                placeholder="As printed on your licence"
                required
              />
            </label>
            <label>
              Mobile number
              <div className="tel-group">
                <CountrySelect value={countryIso} onChange={setCountryIso} />
                <input
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={update('mobile')}
                  placeholder="10-digit mobile number"
                  pattern="[0-9\s-]{6,12}"
                  required
                />
              </div>
            </label>
            <label>
              Email ID
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={update('email')}
                placeholder="you@example.com"
                required
              />
            </label>
            <button className="btn btn-yellow btn-full" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Submit'}
            </button>
            {status === 'success' && <p className="reg-note ok">Thanks - our team will call you shortly.</p>}
            {status === 'error' && <p className="reg-note err">Something went wrong. Please try again.</p>}
            {status !== 'success' && status !== 'error' && <p className="reg-note">We only use these details to verify your registration.</p>}
          </form>
        </div>
      </section>

      <footer className="foot">
        <div className="shell foot-in">
          <div className="brand"><BrandIcon /><span>Fair</span></div>
          <p>Zero commission rides. © {new Date().getFullYear()} Fair.</p>
        </div>
      </footer>
    </>
  )
}
