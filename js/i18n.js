/* ============================================
   i18n — English / Turkish
   ============================================
   Static page text:  <el data-i18n="key">            → textContent
                      <el data-i18n-html="key">       → innerHTML (trusted strings below)
                      <el data-i18n-attr="placeholder:key; aria-label:key">
   Project content lives in projects-data.js (each project has a `tr` block).

   Language choice: ?lang=tr|en in the URL  >  saved choice  >  browser language  >  English.
   Other scripts: I18N.t(key, vars), I18N.lang, I18N.onChange(fn).
============================================ */

(function () {
    'use strict';

    const STRINGS = {
        en: {
            'meta.home.title': 'Eren Atasun — Game Developer & Computer Engineer',
            'meta.home.desc': 'Eren Atasun — Game Developer & Computer Engineer, co-founder of PBH Studio. Portfolio of Unity games, simulations, AI/ML projects, engines and mobile apps.',
            'meta.projects.title': 'Projects — Eren Atasun',
            'meta.projects.desc': 'Projects by Eren Atasun — Unity games, simulations, AI tools, engines and mobile apps, with screenshots and details.',

            'a11y.skip': 'Skip to content',
            'a11y.menuOpen': 'Open menu',
            'a11y.menuClose': 'Close menu',
            'a11y.lang': 'Language',
            'a11y.portrait': 'Portrait of Eren Atasun',

            'nav.home': 'Home',
            'nav.about': 'About',
            'nav.skills': 'Skills',
            'nav.experience': 'Experience',
            'nav.projects': 'Projects',
            'nav.contact': 'Contact',

            'hero.eyebrow': '// Available for opportunities',
            'hero.title': 'Hi, I\'m Eren — <span class="accent">Game Developer</span> &amp; Computer Engineer',
            'hero.subtitle': 'I build games, simulations, AI tools and engines. Co-founder of the indie game studio PBH Studio and currently interning at Bluesense (Boston) and HIFIVE (İstanbul) — bringing ideas from rough sketch to playable prototype.',
            'hero.ctaProjects': 'View Projects',
            'hero.ctaCv': 'Download CV',
            'hero.stat.projects': 'Projects',
            'hero.stat.internships': 'Internships',
            'hero.stat.events': 'Events organized',
            'hero.stat.jams': 'Game jams hosted',

            'about.title': 'About Me',
            'about.p1': 'As a Computer Engineering student passionate about games and simulation, I build interactive systems in Unity, C++ and beyond. I have shipped prototypes across multiple game studios, contributed to AI products during my internships, and led student communities — including founding my university\'s first dedicated game-development club.',
            'about.p2': 'Outside the studio I have coordinated international Erasmus+ projects and supported several non-profit organizations — experiences that taught me how to translate ambiguous needs into shipped solutions, and how to lead cross-functional teams. I\'m always looking for the next problem worth simulating.',

            'edu.title': 'Education',
            'edu.mcbu.meta': 'Sep 2023 – 2026 · Manisa, Turkey',
            'edu.mcbu.desc': 'Bachelor\'s Degree in Computer Engineering.',
            'edu.alku.meta': 'Sep 2021 – 2023 · Alanya, Turkey',
            'edu.alku.desc': 'Bachelor\'s Degree in Computer Engineering — transfer.',

            'skills.title': 'Skills',
            'skills.lang.title': 'Languages',
            'skills.lang.desc': 'The toolbox I reach for on most projects.',
            'skills.tech.title': 'Technologies',
            'skills.tech.desc': 'Engines, frameworks and platforms I work with day to day.',
            'skills.domains.title': 'Domains',
            'skills.domains.desc': 'Areas where I\'ve shipped real work.',
            'skills.soft.title': 'Soft Skills',
            'skills.soft.desc': 'How I work with teams and turn ambiguity into shipped work.',
            'skills.d.gamedev': 'Game Dev',
            'skills.d.sim': 'Simulation',
            'skills.d.mobile': 'Mobile',
            'skills.s.lead': 'Leadership',
            'skills.s.proto': 'Fast prototyping',
            'skills.s.adapt': 'Adaptability',
            'skills.s.pm': 'Project management',

            'featured.title': 'Featured Projects',
            'featured.all': 'All {n} projects',
            'featured.lead': 'A few highlights — click any card for screenshots, my role and the tech behind it.',

            'exp.title': 'Experience',
            'exp.pbh.role': 'PBH Studio — Co-founder',
            'exp.pbh.meta': '2026 – Present · Türkiye',
            'exp.pbh.desc': 'Co-founded Primordial Black Hole Studio, an independent studio making co-op and multiplayer games. Leading development of Pawed Drive (online co-op driving comedy) and Mask Heist, and built the studio\'s bilingual website.',
            'exp.bluesense.role': 'Bluesense — Computer Engineering Intern',
            'exp.bluesense.meta': 'Jan 2026 – Present · Boston, USA',
            'exp.bluesense.desc': 'Contributing to both UI and AI teams: building responsive interfaces and integrating intelligent system components into production workflows. Working remotely in a cross-functional agile environment.',
            'exp.hifive.role': 'HIFIVE — Game Developer Intern',
            'exp.hifive.meta': 'Jan 2026 – Present · İstanbul, Turkey',
            'exp.hifive.desc': 'Shipping core gameplay mechanics, system architecture and performance tuning across two game projects in parallel. Collaborating with marketing on positioning and player engagement strategy.',
            'exp.xrlab.role': 'XRLAB — Game Developer Intern',
            'exp.xrlab.meta': 'Apr 2025 – Sep 2025 · Manisa, Turkey',
            'exp.xrlab.desc': 'Engineered C++-based real-time simulation systems focused on performance optimization, low-latency execution, and hardware–software integration. Built modular components that improved runtime stability and reduced latency in simulation pipelines.',
            'exp.enm.role': 'ENM Digital — Computer Engineering Intern',
            'exp.enm.meta': 'Apr 2024 – Sep 2024 · Manisa, Turkey',
            'exp.enm.desc': 'Implemented core NLP and automation features for the AI application <em>Proje Sihirbazı</em>. Contributed to full-stack team projects across web and mobile.',
            'exp.oua.role': 'Oyun ve Uygulama Akademisi — Trainee',
            'exp.oua.meta': 'Jan 2024 – Sep 2024',
            'exp.oua.desc': 'Structured Unity mentorship — gameplay programming, plus startup management and product commercialization for game studios. Expanded my professional network across the game-dev and entrepreneurship ecosystem.',
            'exp.velo.role': 'Velo Games Studios — Game Developer Intern',
            'exp.velo.meta': 'Jan 2024 – Jul 2024',
            'exp.velo.desc': 'Delivered multiple game prototypes (Subway Surfers-style, Candy Crush-style) under the mentorship of senior developer Tolga Karanlıkoğlu. Designed and built a C# book-library management system applying OOP design patterns.',
            'exp.codeo.role': 'Codeo — Game Developer Intern',
            'exp.codeo.meta': 'Aug 2023 – Sep 2023 · İzmir, Turkey',
            'exp.codeo.desc': 'Implemented tile-based grid and lock systems in Unity, enforcing SOLID principles across the codebase to keep game logic maintainable.',

            'comm.title': 'Community &amp; Leadership',
            'comm.otgt.role': 'Oyun Tasarımı ve Geliştiricileri Topluluğu — Lead',
            'comm.otgt.meta': 'Sep 2024 – Present',
            'comm.otgt.desc': 'Leading a student game-development community: organized 20+ technical events and 3 game jams. Managing 3 GSB (ÜNİDES) funded projects with 250,000 TL+ budget across cross-functional student teams.',
            'comm.100s.role': '100sClub — Campus Leader',
            'comm.100s.meta': 'Jul 2024 – Sep 2025',
            'comm.100s.desc': 'Represented 100sClub on campus, attending leadership and entrepreneurship trainings while expanding a national student professional network.',
            'comm.talentia.role': 'Talentia Union — Community Manager',
            'comm.talentia.meta': 'May 2024 – Sep 2025',
            'comm.talentia.desc': 'Structured community operations and led event planning, improving organizational efficiency and member engagement.',
            'comm.dogt.role': 'Dijital Oyun Geliştirme Ekibi CBU — Founder Lead',
            'comm.dogt.meta': 'Nov 2023 – Sep 2024',
            'comm.dogt.desc': 'Founded my university\'s first dedicated game-development community — established team structure, organized events, and cultivated a collaborative culture among student developers.',
            'comm.gf.role': 'Game Factory — Campus Ambassador',
            'comm.gf.meta': 'Aug 2023 – Sep 2024',
            'comm.gf.desc': 'Built and managed a Game Factory ambassador community, organizing industry-aligned events and serving as the primary liaison between the company and student developers.',

            'contact.title': 'Contact',
            'contact.lead': 'Open to internships, full-time roles and game-jam teams. The fastest way to reach me is email or LinkedIn.',
            'contact.email': 'Email',
            'contact.phone': 'Phone',
            'contact.location': 'Location',
            'contact.locationValue': 'İzmir, Turkey',

            'studio.kicker': '// My studio',
            'studio.title': 'Co-founder of PBH Studio',
            'studio.desc': 'Primordial Black Hole Studio is the independent game studio I co-founded with Gonca Arabacı. We make co-op and multiplayer games that get people talking — and shouting. Now in development: Pawed Drive and Mask Heist.',
            'studio.site': 'Studio website',
            'skills.d.multiplayer': 'Multiplayer',
            'skills.d.vision': 'Computer Vision',
            'skills.s.design': 'Game design (GDD)',

            'projects.eyebrow': '// Portfolio',
            'projects.title': 'Projects',
            'projects.lead': 'Games, simulations, AI tools, a C++ engine and mobile apps — from studio case studies and game jams to funded research. Open any project for screenshots, my role, key highlights and source code.',
            'projects.statsLabel': 'Portfolio at a glance',
            'projects.search': 'Search by name, tech or keyword (e.g. Unity, Flutter, AI)',
            'projects.searchLabel': 'Search projects',
            'projects.sortLabel': 'Sort projects',
            'projects.sort.featured': 'Highlights first',
            'projects.sort.newest': 'Newest first',
            'projects.sort.az': 'A – Z',
            'projects.filterLabel': 'Filter by category',
            'projects.empty': 'No projects match your search.',
            'projects.clear': 'Clear filters',
            'projects.countAll': 'Showing all {n} projects',
            'projects.countSome': 'Showing {n} of {total} projects',
            'projects.all': 'All',
            'stats.projects': 'Projects',
            'stats.games': 'Games',
            'stats.programs': 'Funded / competition / thesis',
            'stats.visuals': 'With screenshots',

            'card.details': 'View details',
            'card.code': 'Code',
            'card.codeLabel': '{title} source code on GitHub',
            'card.shots': '{n} screenshots',
            'card.featuredSoon': 'Featured projects coming soon.',

            'modal.close': 'Close project details',
            'modal.overview': 'Overview',
            'modal.highlights': 'Key highlights',
            'modal.video': 'Video',
            'modal.info': 'Project info',
            'modal.tech': 'Tech &amp; tools',
            'modal.role': 'Role',
            'modal.team': 'Team',
            'modal.timeline': 'Timeline',
            'modal.category': 'Category',
            'modal.source': 'View source',
            'modal.demo': 'Play demo',
            'modal.videoLink': 'Gameplay video',
            'modal.doc': 'Design document',
            'modal.page': 'Studio page',
            'modal.site': 'Visit website',
            'modal.status': 'Status',
            'modal.private': 'Source is private or not published.',
            'modal.prev': 'Previous',
            'modal.next': 'Next',
            'modal.screenshots': 'Screenshots',
            'modal.screenshot': 'Screenshot {n}',
            'modal.openFull': 'Open screenshot full screen',
            'modal.videoTitle': 'Project video',
            'modal.watch': 'Watch video',
            'lb.label': 'Screenshot viewer',
            'lb.close': 'Close viewer',
            'lb.prev': 'Previous screenshot',
            'lb.next': 'Next screenshot',
            'lb.alt': 'Screenshot {n} of {total}',
        },

        tr: {
            'meta.home.title': 'Eren Atasun — Oyun Geliştirici & Bilgisayar Mühendisi',
            'meta.home.desc': 'Eren Atasun — Oyun Geliştirici ve Bilgisayar Mühendisi, PBH Studio kurucu ortağı. Unity oyunları, simülasyonlar, yapay zekâ projeleri, oyun motorları ve mobil uygulamalardan oluşan portfolyo.',
            'meta.projects.title': 'Projeler — Eren Atasun',
            'meta.projects.desc': 'Eren Atasun\'un projeleri — Unity oyunları, simülasyonlar, yapay zekâ araçları, oyun motorları ve mobil uygulamalar; ekran görüntüleri ve detaylarıyla.',

            'a11y.skip': 'İçeriğe geç',
            'a11y.menuOpen': 'Menüyü aç',
            'a11y.menuClose': 'Menüyü kapat',
            'a11y.lang': 'Dil',
            'a11y.portrait': 'Eren Atasun portresi',

            'nav.home': 'Ana Sayfa',
            'nav.about': 'Hakkımda',
            'nav.skills': 'Yetenekler',
            'nav.experience': 'Deneyim',
            'nav.projects': 'Projeler',
            'nav.contact': 'İletişim',

            'hero.eyebrow': '// Yeni fırsatlara açığım',
            'hero.title': 'Merhaba, ben Eren — <span class="accent">Oyun Geliştirici</span> &amp; Bilgisayar Mühendisi',
            'hero.subtitle': 'Oyunlar, simülasyonlar, yapay zekâ araçları ve oyun motorları geliştiriyorum. Bağımsız oyun stüdyosu PBH Studio\'nun kurucu ortağıyım; şu anda Bluesense (Boston) ve HIFIVE (İstanbul)\'da stajyerim — fikirleri kaba bir taslaktan oynanabilir prototipe taşıyorum.',
            'hero.ctaProjects': 'Projeleri İncele',
            'hero.ctaCv': 'CV İndir',
            'hero.stat.projects': 'Proje',
            'hero.stat.internships': 'Staj',
            'hero.stat.events': 'Düzenlenen etkinlik',
            'hero.stat.jams': 'Düzenlenen game jam',

            'about.title': 'Hakkımda',
            'about.p1': 'Oyunlara ve simülasyona tutkuyla bağlı bir Bilgisayar Mühendisliği öğrencisi olarak Unity, C++ ve daha fazlasıyla etkileşimli sistemler geliştiriyorum. Birçok oyun stüdyosunda prototipler teslim ettim, stajlarımda yapay zekâ ürünlerine katkı sağladım ve öğrenci topluluklarına liderlik ettim — üniversitemin ilk oyun geliştirme kulübünü kurmak da dahil.',
            'about.p2': 'Stüdyo dışında uluslararası Erasmus+ projeleri koordine ettim ve birçok sivil toplum kuruluşuna destek verdim. Bu deneyimler bana belirsiz ihtiyaçları teslim edilmiş çözümlere dönüştürmeyi ve farklı disiplinlerden ekipleri yönetmeyi öğretti. Her zaman simüle etmeye değer bir sonraki problemin peşindeyim.',

            'edu.title': 'Eğitim',
            'edu.mcbu.meta': 'Eyl 2023 – 2026 · Manisa, Türkiye',
            'edu.mcbu.desc': 'Bilgisayar Mühendisliği lisans.',
            'edu.alku.meta': 'Eyl 2021 – 2023 · Alanya, Türkiye',
            'edu.alku.desc': 'Bilgisayar Mühendisliği lisans — yatay geçiş.',

            'skills.title': 'Yetenekler',
            'skills.lang.title': 'Diller',
            'skills.lang.desc': 'Çoğu projede başvurduğum araç kutusu.',
            'skills.tech.title': 'Teknolojiler',
            'skills.tech.desc': 'Günlük olarak çalıştığım motorlar, framework\'ler ve platformlar.',
            'skills.domains.title': 'Alanlar',
            'skills.domains.desc': 'Gerçek iş teslim ettiğim alanlar.',
            'skills.soft.title': 'Kişisel Yetkinlikler',
            'skills.soft.desc': 'Ekiplerle nasıl çalıştığım ve belirsizliği nasıl teslim edilen işe dönüştürdüğüm.',
            'skills.d.gamedev': 'Oyun Geliştirme',
            'skills.d.sim': 'Simülasyon',
            'skills.d.mobile': 'Mobil',
            'skills.s.lead': 'Liderlik',
            'skills.s.proto': 'Hızlı prototipleme',
            'skills.s.adapt': 'Uyum yeteneği',
            'skills.s.pm': 'Proje yönetimi',

            'featured.title': 'Öne Çıkan Projeler',
            'featured.all': 'Tüm {n} proje',
            'featured.lead': 'Öne çıkanlardan birkaçı — ekran görüntüleri, rolüm ve kullanılan teknolojiler için bir karta tıkla.',

            'exp.title': 'Deneyim',
            'exp.pbh.role': 'PBH Studio — Kurucu Ortak',
            'exp.pbh.meta': '2026 – Günümüz · Türkiye',
            'exp.pbh.desc': 'Co-op ve çok oyunculu oyunlar yapan bağımsız stüdyo Primordial Black Hole Studio\'yu kurdum. Pawed Drive (online co-op sürüş komedisi) ve Mask Heist\'in geliştirmesini yönetiyorum; stüdyonun iki dilli web sitesini geliştirdim.',
            'exp.bluesense.role': 'Bluesense — Bilgisayar Mühendisliği Stajyeri',
            'exp.bluesense.meta': 'Oca 2026 – Günümüz · Boston, ABD',
            'exp.bluesense.desc': 'Hem arayüz hem yapay zekâ ekiplerine katkı sağlıyorum: duyarlı arayüzler geliştiriyor ve akıllı sistem bileşenlerini üretim akışlarına entegre ediyorum. Disiplinler arası çevik bir ekipte uzaktan çalışıyorum.',
            'exp.hifive.role': 'HIFIVE — Oyun Geliştirici Stajyeri',
            'exp.hifive.meta': 'Oca 2026 – Günümüz · İstanbul, Türkiye',
            'exp.hifive.desc': 'Paralel yürüyen iki oyun projesinde temel oynanış mekanikleri, sistem mimarisi ve performans iyileştirmeleri geliştiriyorum. Konumlandırma ve oyuncu etkileşimi stratejisi için pazarlama ekibiyle birlikte çalışıyorum.',
            'exp.xrlab.role': 'XRLAB — Oyun Geliştirici Stajyeri',
            'exp.xrlab.meta': 'Nis 2025 – Eyl 2025 · Manisa, Türkiye',
            'exp.xrlab.desc': 'Performans optimizasyonu, düşük gecikme ve donanım–yazılım entegrasyonuna odaklanan C++ tabanlı gerçek zamanlı simülasyon sistemleri geliştirdim. Simülasyon hatlarında çalışma kararlılığını artıran ve gecikmeyi azaltan modüler bileşenler yazdım.',
            'exp.enm.role': 'ENM Digital — Bilgisayar Mühendisliği Stajyeri',
            'exp.enm.meta': 'Nis 2024 – Eyl 2024 · Manisa, Türkiye',
            'exp.enm.desc': 'Yapay zekâ uygulaması <em>Proje Sihirbazı</em> için temel NLP ve otomasyon özelliklerini geliştirdim. Web ve mobil tarafta full-stack ekip projelerine katkı sağladım.',
            'exp.oua.role': 'Oyun ve Uygulama Akademisi — Katılımcı',
            'exp.oua.meta': 'Oca 2024 – Eyl 2024',
            'exp.oua.desc': 'Yapılandırılmış Unity mentorluğu — oynanış programlamanın yanında oyun stüdyoları için girişim yönetimi ve ürün ticarileştirme. Oyun geliştirme ve girişimcilik ekosisteminde profesyonel ağımı genişlettim.',
            'exp.velo.role': 'Velo Games Studios — Oyun Geliştirici Stajyeri',
            'exp.velo.meta': 'Oca 2024 – Tem 2024',
            'exp.velo.desc': 'Kıdemli geliştirici Tolga Karanlıkoğlu\'nun mentorluğunda birden fazla oyun prototipi (Subway Surfers tarzı, Candy Crush tarzı) teslim ettim. OOP tasarım kalıplarını uygulayan bir C# kütüphane yönetim sistemi tasarlayıp geliştirdim.',
            'exp.codeo.role': 'Codeo — Oyun Geliştirici Stajyeri',
            'exp.codeo.meta': 'Ağu 2023 – Eyl 2023 · İzmir, Türkiye',
            'exp.codeo.desc': 'Unity\'de karo tabanlı grid ve kilit sistemleri geliştirdim; oyun mantığını sürdürülebilir tutmak için kod tabanında SOLID prensiplerini uyguladım.',

            'comm.title': 'Topluluk &amp; Liderlik',
            'comm.otgt.role': 'Oyun Tasarımı ve Geliştiricileri Topluluğu — Başkan',
            'comm.otgt.meta': 'Eyl 2024 – Günümüz',
            'comm.otgt.desc': 'Bir öğrenci oyun geliştirme topluluğunu yönetiyorum: 20\'den fazla teknik etkinlik ve 3 game jam düzenledim. 250.000 TL\'yi aşan bütçeli, GSB (ÜNİDES) destekli 3 projeyi disiplinler arası öğrenci ekipleriyle yürütüyorum.',
            'comm.100s.role': '100sClub — Kampüs Lideri',
            'comm.100s.meta': 'Tem 2024 – Eyl 2025',
            'comm.100s.desc': '100sClub\'ı kampüste temsil ettim; liderlik ve girişimcilik eğitimlerine katılarak ulusal bir öğrenci profesyonel ağını genişlettim.',
            'comm.talentia.role': 'Talentia Union — Topluluk Yöneticisi',
            'comm.talentia.meta': 'May 2024 – Eyl 2025',
            'comm.talentia.desc': 'Topluluk operasyonlarını yapılandırdım ve etkinlik planlamasını yönettim; organizasyon verimliliğini ve üye katılımını artırdım.',
            'comm.dogt.role': 'Dijital Oyun Geliştirme Ekibi CBÜ — Kurucu Başkan',
            'comm.dogt.meta': 'Kas 2023 – Eyl 2024',
            'comm.dogt.desc': 'Üniversitemin ilk oyun geliştirme topluluğunu kurdum — ekip yapısını oluşturdum, etkinlikler düzenledim ve öğrenci geliştiriciler arasında iş birliği kültürü geliştirdim.',
            'comm.gf.role': 'Game Factory — Kampüs Elçisi',
            'comm.gf.meta': 'Ağu 2023 – Eyl 2024',
            'comm.gf.desc': 'Game Factory elçi topluluğunu kurup yönettim; sektörle uyumlu etkinlikler düzenledim ve şirket ile öğrenci geliştiriciler arasında ana iletişim noktası oldum.',

            'contact.title': 'İletişim',
            'contact.lead': 'Staj, tam zamanlı pozisyonlar ve game jam ekiplerine açığım. Bana ulaşmanın en hızlı yolu e-posta veya LinkedIn.',
            'contact.email': 'E-posta',
            'contact.phone': 'Telefon',
            'contact.location': 'Konum',
            'contact.locationValue': 'İzmir, Türkiye',

            'studio.kicker': '// Stüdyom',
            'studio.title': 'PBH Studio Kurucu Ortağı',
            'studio.desc': 'Primordial Black Hole Studio, Gonca Arabacı ile birlikte kurduğum bağımsız oyun stüdyosu. İnsanları konuşturan — ve bağırtan — co-op ve çok oyunculu oyunlar yapıyoruz. Geliştirilenler: Pawed Drive ve Mask Heist.',
            'studio.site': 'Stüdyo sitesi',
            'skills.d.multiplayer': 'Çok Oyunculu',
            'skills.d.vision': 'Bilgisayarlı Görü',
            'skills.s.design': 'Oyun tasarımı (GDD)',

            'projects.eyebrow': '// Portfolyo',
            'projects.title': 'Projeler',
            'projects.lead': 'Oyunlar, simülasyonlar, yapay zekâ araçları, bir C++ oyun motoru ve mobil uygulamalar — stüdyo vaka çalışmalarından game jam\'lere ve desteklenen araştırma projelerine kadar. Ekran görüntüleri, rolüm, öne çıkanlar ve kaynak kod için herhangi bir projeyi aç.',
            'projects.statsLabel': 'Portfolyoya genel bakış',
            'projects.search': 'İsim, teknoloji veya anahtar kelimeyle ara (ör. Unity, Flutter, yapay zekâ)',
            'projects.searchLabel': 'Projelerde ara',
            'projects.sortLabel': 'Projeleri sırala',
            'projects.sort.featured': 'Öne çıkanlar önce',
            'projects.sort.newest': 'En yeni önce',
            'projects.sort.az': 'A – Z',
            'projects.filterLabel': 'Kategoriye göre filtrele',
            'projects.empty': 'Aramana uygun proje bulunamadı.',
            'projects.clear': 'Filtreleri temizle',
            'projects.countAll': '{n} projenin tümü gösteriliyor',
            'projects.countSome': '{total} projeden {n} tanesi gösteriliyor',
            'projects.all': 'Tümü',
            'stats.projects': 'Proje',
            'stats.games': 'Oyun',
            'stats.programs': 'Destekli / yarışma / bitirme',
            'stats.visuals': 'Ekran görüntülü',

            'card.details': 'Detayları gör',
            'card.code': 'Kod',
            'card.codeLabel': '{title} kaynak kodu (GitHub)',
            'card.shots': '{n} ekran görüntüsü',
            'card.featuredSoon': 'Öne çıkan projeler yakında.',

            'modal.close': 'Proje detaylarını kapat',
            'modal.overview': 'Genel bakış',
            'modal.highlights': 'Öne çıkanlar',
            'modal.video': 'Video',
            'modal.info': 'Proje bilgileri',
            'modal.tech': 'Teknolojiler &amp; araçlar',
            'modal.role': 'Rol',
            'modal.team': 'Ekip',
            'modal.timeline': 'Zaman',
            'modal.category': 'Kategori',
            'modal.source': 'Kaynak kodu',
            'modal.demo': 'Demoyu oyna',
            'modal.videoLink': 'Oynanış videosu',
            'modal.doc': 'Tasarım dokümanı',
            'modal.page': 'Stüdyo sayfası',
            'modal.site': 'Siteyi ziyaret et',
            'modal.status': 'Durum',
            'modal.private': 'Kaynak kod gizli veya yayımlanmamış.',
            'modal.prev': 'Önceki',
            'modal.next': 'Sonraki',
            'modal.screenshots': 'Ekran görüntüleri',
            'modal.screenshot': 'Ekran görüntüsü {n}',
            'modal.openFull': 'Ekran görüntüsünü tam ekran aç',
            'modal.videoTitle': 'Proje videosu',
            'modal.watch': 'Videoyu izle',
            'lb.label': 'Ekran görüntüsü görüntüleyici',
            'lb.close': 'Görüntüleyiciyi kapat',
            'lb.prev': 'Önceki ekran görüntüsü',
            'lb.next': 'Sonraki ekran görüntüsü',
            'lb.alt': 'Ekran görüntüsü {n} / {total}',
        },
    };

    const SUPPORTED = Object.keys(STRINGS);
    const STORAGE_KEY = 'lang';
    const listeners = [];

    function readStored() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (_) { return null; }
    }
    function store(lang) {
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) { /* private mode etc. */ }
    }

    function initialLang() {
        const fromUrl = new URLSearchParams(location.search).get('lang');
        if (SUPPORTED.includes(fromUrl)) { store(fromUrl); return fromUrl; }
        const saved = readStored();
        if (SUPPORTED.includes(saved)) return saved;
        const browser = (navigator.languages || [navigator.language || 'en']).map((l) => String(l).toLowerCase());
        return browser.some((l) => l.startsWith('tr')) ? 'tr' : 'en';
    }

    const I18N = {
        lang: initialLang(),

        t(key, vars) {
            const table = STRINGS[I18N.lang] || STRINGS.en;
            let s = key in table ? table[key] : (STRINGS.en[key] ?? key);
            if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
            return s;
        },

        // Pick a localized field from a data object that carries a `tr` block.
        pick(obj, field) {
            if (!obj) return undefined;
            if (I18N.lang !== 'en' && obj[I18N.lang] && obj[I18N.lang][field] != null) return obj[I18N.lang][field];
            return obj[field];
        },

        apply(root) {
            const scope = root || document;
            const page = document.body && document.body.dataset.page;
            document.documentElement.lang = I18N.lang;
            scope.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = I18N.t(el.dataset.i18n); });
            scope.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = I18N.t(el.dataset.i18nHtml); });
            scope.querySelectorAll('[data-i18n-attr]').forEach((el) => {
                el.dataset.i18nAttr.split(';').forEach((pair) => {
                    const [attr, key] = pair.split(':').map((s) => s.trim());
                    if (attr && key) el.setAttribute(attr, I18N.t(key));
                });
            });
            if (page) {
                document.title = I18N.t(`meta.${page}.title`);
                const desc = document.querySelector('meta[name="description"]');
                if (desc) desc.setAttribute('content', I18N.t(`meta.${page}.desc`));
            }
            document.querySelectorAll('.lang-switch [data-lang]').forEach((btn) => {
                btn.setAttribute('aria-pressed', String(btn.dataset.lang === I18N.lang));
            });
        },

        setLang(lang) {
            if (!SUPPORTED.includes(lang) || lang === I18N.lang) return;
            I18N.lang = lang;
            store(lang);
            // Keep a ?lang= param in sync if the page was opened with one
            const url = new URL(location.href);
            if (url.searchParams.has('lang')) {
                url.searchParams.set('lang', lang);
                history.replaceState(null, '', url);
            }
            I18N.apply();
            listeners.forEach((fn) => { try { fn(lang); } catch (e) { console.error(e); } });
        },

        onChange(fn) { listeners.push(fn); },
    };

    window.I18N = I18N;
    I18N.apply();

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.lang-switch [data-lang]');
        if (btn) I18N.setLang(btn.dataset.lang);
    });
})();
