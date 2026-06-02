const state = {
  lang: "en",
  selectedPackageId: window.GSL_PACKAGES[0]?.id,
  filters: {
    country: "all",
    state: "all",
    city: "all",
    sort: "featured"
  }
};

const copy = {
  en: {
    nav: { about: "About", activities: "Featured Activities", packages: "Packages", care: "Care Services", contact: "Contact" },
    hero: {
      eyebrow: "Cross-border retirement and wellness living",
      title: "Global Second Life",
      body: "A trusted bridge for overseas Chinese and global families designing a healthier, freer, and more meaningful second stage of life.",
      primary: "Explore Packages",
      secondary: "Contact Us",
      stat1: "sample destinations",
      stat2: "bilingual experience",
      stat3: "platform ready"
    },
    about: {
      eyebrow: "Welcome to Global Second Life",
      title: "Retirement is the beginning of your Second Life.",
      p1: "Global Second Life is a cross-border retirement and lifestyle platform designed for overseas Chinese and global families who want a healthier, freer, and more meaningful second stage of life.",
      p2: "We help families explore life after midlife through retirement planning, wellness living, global mobility, healthcare resources, cultural connection, and purpose-driven community.",
      p3: "",
      p4: ""
    },
    dreams: [
      "Living part-time in China or Asia",
      "Finding the best wellness and retirement destinations",
      "Accessing quality healthcare and traditional Chinese medicine",
      "Building a peaceful lifestyle surrounded by nature and community",
      "Managing retirement, taxes, and global assets wisely",
      "Staying connected with family across countries",
      "Designing a life filled with meaning, freedom, and vitality"
    ],
    services: {
      eyebrow: "What We Provide",
      title: "A complete bridge for planning, care, community, and mobility.",
      items: [
        ["Global Retirement & Lifestyle Planning", "Guidance for cross-border retirement living, long-stay travel, relocation options, and lifestyle design."],
        ["Wellness & Retirement Destinations", "Curated cities, communities, resorts, and wellness centers focused on climate, healthcare, culture, and quality of life."],
        ["Health & Longevity Resources", "Connections to wellness programs, traditional Chinese medicine, rehabilitation, anti-aging services, and healthy living experiences."],
        ["Community & Social Connection", "A supportive global community where people build friendships, travel together, share experiences, and create a fulfilling second life."],
        ["Retirement & Financial Education", "Educational resources for retirement strategies, tax awareness, insurance, asset protection, and long-term planning."],
        ["AI-Powered Companion & Digital Platform", "Technology and AI tools designed to help users navigate retirement decisions, discover opportunities, and stay connected globally."]
      ]
    },
    activities: {
      eyebrow: "Featured Activities",
      title: "Cultural experiences that make every journey more meaningful.",
      description: "Hands-on heritage workshops help travelers connect with local culture, community, and a slower way of living.",
      handcraft: "Heritage Handcraft Experience",
      music: "Immersive Art Music Experience",
      musicDescription: "Step into beautiful musical moments, release stress through relaxation, and feel the beauty of life through resonance. This is not only an auditory feast, but also a memorable spiritual journey that heals the body and mind and awakens the senses.",
      tcm: "Traditional Chinese Medicine Featured Activity",
      tcmDescription: "Traditional Chinese medicine carries thousands of years of Eastern wellness wisdom. Through acupuncture, moxibustion, cupping, herbal conditioning, and meridian work, it helps the body restore balance and vitality. It focuses not only on symptoms, but also on whole-person nourishment and life energy. For midlife and older adults, TCM wellness may support better sleep, strength, pain relief, circulation, and immunity, helping the body feel lighter and the mind calmer. In nature and careful conditioning, travelers can reconnect with health, confidence, and a more youthful state of vitality."
    },
    packages: { eyebrow: "Modular packages", title: "Curated retirement, wellness, and lifestyle experiences." },
    filters: {
      country: "Country",
      state: "State / Province",
      city: "City",
      sort: "Sort",
      featured: "Featured",
      byCountry: "Country",
      byCity: "City",
      all: "All"
    },
    card: {
      days: "days",
      details: "View details",
      checkout: "Reserve package",
      comingSoon: "Coming soon",
      videoReady: "Video area ready for hosted media"
    },
    care: {
      eyebrow: "Care services",
      title: "Professional care that brings warmth, dignity, and daily peace of mind.",
      body: "Based on each elder’s physical condition, professional care teams provide standardized nursing services at different levels. Trained caregivers help with clothing organization, bedding, bathing, foot care, nail trimming, indoor and outdoor activities, sunlight time, morning and evening care, and nearly one hundred daily living services. Depending on care level, they also provide dedicated support for meals, dressing, back patting, turning, toileting, bathing, and other detailed personal needs. Housekeeping staff regularly clean rooms and wash bedding and clothing. Nutritionists provide meal guidance and healthy diet plans, while social workers offer emotional comfort, spiritual care, activity support, and help resolving daily concerns."
    },
    mission: {
      eyebrow: "Our Mission",
      title: "Reduce anxiety, preserve dignity, and make retirement easier to understand.",
      body: "We help parents age with dignity, help children feel peace of mind, and make retirement no longer confusing.",
      vision: "Our vision is to become the world’s leading global Chinese retirement and wellness lifestyle platform, helping people create a vibrant, healthy, and meaningful second life anywhere in the world."
    },
    contact: {
      eyebrow: "Information and contact",
      title: "Start a conversation about your family’s second life plan.",
      name: "Name",
      emailInput: "Email",
      message: "Message",
      send: "Send Inquiry",
      email: "Email",
      phone: "Phone",
      redbook: "Little Red Book",
      sent: "Thank you. This demo form is ready to connect to your CRM or email service."
    },
    checkout: {
      title: "Reserve your package",
      purchaser: "Traveler information",
      payment: "Online payment setup",
      fullName: "Full name",
      email: "Email",
      travelers: "Travelers",
      pay: "Continue to secure payment",
      provider: "Payment provider",
      stripe: "Stripe",
      paypal: "PayPal",
      manual: "Advisor follow-up",
      notice: "Payment infrastructure is prepared. Add live provider keys before accepting real payments.",
      success: "Reservation captured. Connect the payment adapter to charge online."
    },
    footer: { copy: "Retirement is not the end of life. It is the beginning of your Second Life." }
  },
  zh: {
    nav: { about: "关于我们", activities: "特色活动", packages: "旅居套餐", care: "照护服务", contact: "联系我们" },
    hero: {
      eyebrow: "跨境退休与康养生活平台",
      title: "第二人生\n全球旅居康养平台",
      body: "为海外华人和全球家庭打造可信赖的跨境退休与康养生活平台，\n规划更年轻，更健康，更自由，更幸福的人生第二阶段",
      primary: "查看套餐",
      secondary: "联系我们",
      stat1: "示例目的地",
      stat2: "中英文体验",
      stat3: "AI 平台就绪"
    },
    about: {
      eyebrow: "欢迎来到 Global Second Life",
      title: "真正的自由，不是停止前行，\n而是终于可以按照自己真正想要的方式去生活。",
      p1: "Global Second Life 是面向海外华人与全球家庭的跨境退休与生活方式平台，致力于帮助人们开启更健康、更自由、更有意义的人生第二阶段。",
      p2: "我们融合退休规划、康养旅居、全球流动、医疗资源、文化连接与高质量社群，帮助家庭重新设计中年之后的人生方式与生活状态。",
      p3: "无论是寻找理想的退休旅居地、探索健康长寿生活、链接全球资源，还是实现财富、家庭与精神层面的平衡，Global Second Life 都希望成为连接世界与第二人生的桥梁。",
      p4: "退休不是人生的终点，\n而是第二人生的开始。"
    },
    dreams: [
      "设计全球高品质季节性旅居与康养套餐",
      "探索全球优质康养与退休旅居目的地",
      "链接高质量医疗、中医与健康修复资源，打造身心焕新的年轻化康养体验",
      "在自然、人文与高质量社群中，建立身心灵平衡而宁静的生活方式",
      "智慧规划退休、税务与全球资产配置，实现长期安心与财富传承",
      "帮助跨国家庭在全球流动中依然保持紧密连接与情感归属",
      "找到志同道合、真正适合自己的退休旅居伙伴与高质量沟通社群",
      "设计幸福、自由、充满活力与意义感的人生第二阶段"
    ],
    services: {
      eyebrow: "我们提供什么",
      title: "连接规划、健康、社群与全球流动的一站式桥梁。",
      items: [
        ["私人策划全球退休与生活方式", "提供跨境退休、全球旅居、迁居选择与人生第二阶段生活方式的私人定制指导，帮助人们开启更自由、更健康、更有意义的人生新篇章。"],
        ["康养与退休目的地", "精选城市、社区、度假村与康养中心，关注气候、医疗、文化与生活质量。"],
        ["健康与长寿资源", "连接全球优质康养项目、中医调理、康复修复、抗衰年轻化与健康管理资源，打造身心焕新、活力长寿的人生体验。"],
        ["社区与社交连接", "建立互动交流的全球华人社群，让人们结交志同道合的朋友、结伴旅居、分享人生经验，共同创造充实而有归属感的第二人生。"],
        ["退休与财务策略", "提供退休规划、税务优化、全球资产配置与财富传承等相关教育与咨询，帮助人们更安心、更智慧地面对人生第二阶段。"],
        ["AI 陪伴与数字平台", "以技术和 AI 工具帮助用户导航退休决策、发现机会并保持全球连接。"]
      ]
    },
    activities: {
      eyebrow: "特色活动",
      title: "非遗手工体验",
      description: "非遗手工体验不仅是一种传统技艺的学习，更是一场让人慢下来、沉浸当下的身心之旅。在一针一线、一雕一刻之间，人们能够感受到东方文化的温度与匠心，重新连接内在的宁静与专注。手工创作的过程有助于缓解压力、平衡情绪、提升审美与专注力，也让人在与文化、自然和人的连接中，获得内心的充实与疗愈。让旅居生活不仅停留于观光，更成为一次陶冶心灵、提升生命质感的美好体验。",
      handcraft: "非遗手工体验",
      music: "沉浸式艺术音乐体验",
      musicDescription: "沉浸于音乐的美妙时光，在放松中释放压力，在共鸣中感受生活之美。这里不仅是听觉盛宴，更是一段疗愈身心、唤醒感知、令人难忘的精神旅程。",
      tcm: "中医特色活动",
      tcmDescription: "中医传统疗法承载着数千年的东方养生智慧，通过针灸、艾灸、拔罐、中药调理、经络疏通等方式，帮助身体恢复平衡与活力。它不仅关注疾病本身，更注重整体调养与生命能量的提升。对于中老年人而言，中医能够帮助改善睡眠、增强体力、缓解疼痛、促进循环、提升免疫力，让身体更加轻盈有力，精神更加平和充沛。在自然与调养中，重新找回健康、自信与年轻状态，体验身轻体健、焕发生命活力的美好人生。"
    },
    packages: { eyebrow: "模块化套餐", title: "精选退休、康养与生活方式体验。" },
    filters: {
      country: "国家",
      state: "州 / 省",
      city: "城市",
      sort: "排序",
      featured: "推荐",
      byCountry: "按国家",
      byCity: "按城市",
      all: "全部"
    },
    card: {
      days: "天",
      details: "查看详情",
      checkout: "预订套餐",
      comingSoon: "即将上线",
      videoReady: "视频区域已预留，可接入托管视频"
    },
    care: {
      eyebrow: "照护服务专区",
      title: "专业照护，让爱有温度。",
      body: "根据长者身体状况，养护中心专业的护理团队，为长者提供不同等级的规范化护理服务。经过专业培训的护理人员，为长者提供整理衣物、床铺，洗浴、洗脚、修剪指甲、帮助室内外活动、沐浴阳光、晨晚间护理和各类生活照料等近百项服务；根据照护级别提供服侍饮食、穿衣、叩背、翻身、如厕、沐浴等细节化的个人专享服务。保洁员定期上门进行居室保洁、清洗床上用品和衣物等。配备的营养师，定期上门指导营养配餐，制定健康饮食方案。社工师定期上门对长者进行精神慰藉、灵性关怀，带动活动和解决矛盾等。"
    },
    mission: {
      eyebrow: "我们的使命",
      title: "帮助全球家庭减少焦虑，让父母有尊严地老去，让子女更加安心。",
      body: "我们希望让退休不再复杂和迷茫，让家庭更容易看见可执行的选择。",
      vision: "我们的愿景是成为全球领先的华人退休与康养生活方式平台，帮助人们在世界任何地方创造健康、有活力、有意义的 Second Life。"
    },
    contact: {
      eyebrow: "信息与联系",
      title: "开始沟通您家庭的 Second Life 计划。",
      name: "姓名",
      emailInput: "邮箱",
      message: "留言",
      send: "发送咨询",
      email: "邮箱",
      phone: "电话",
      redbook: "小红书",
      sent: "谢谢。这一演示表单已准备好连接 CRM 或邮件服务。"
    },
    checkout: {
      title: "预订套餐",
      purchaser: "旅客信息",
      payment: "在线支付设置",
      fullName: "姓名",
      email: "邮箱",
      travelers: "人数",
      pay: "继续安全支付",
      provider: "支付服务",
      stripe: "Stripe",
      paypal: "PayPal",
      manual: "顾问跟进",
      notice: "支付基础设施已预留。正式收款前请接入真实支付密钥。",
      success: "预订信息已记录。接入支付适配器后即可在线收款。"
    },
    footer: { copy: "退休不是人生的结束，而是 Second Life 的开始。" }
  }
};

const icons = ["🌏", "🏡", "❤️", "🤝", "💰", "🤖"];

const dreamIcons = [
  `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 35h32M12 30c5-4 19-4 24 0M15 24l6-9 7 9M28 24l5-7 6 7M12 13c5-5 10-5 13 0M25 13c3-5 8-5 11 0M24 13v17M37 10h4M39 6v8M35 7l3 3M35 13l3-3"/></svg>`,
  `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5c7 0 12 5 12 12 0 9-12 22-12 22S12 26 12 17c0-7 5-12 12-12Z"/><circle cx="24" cy="17" r="4"/><path d="M10 39h28M35 11h4M37 7v8M33 8l3 3M33 14l3-3"/></svg>`,
  `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M19 7h10v10h10v10H29v14H19V27H9V17h10Z"/><path d="M30 34c4-9 10-12 13-11-1 7-5 12-13 13M28 38c0-8 3-13 9-16"/></svg>`,
  `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 25 24 13l14 12v16H10Z"/><path d="M19 41V29h10v12M7 41h34M8 24c-1-6 2-10 7-12M40 24c1-6-2-10-7-12M16 38c-4-4-8-5-12-3M32 38c4-4 8-5 12-3"/></svg>`,
  `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="20" cy="22" r="13"/><path d="M7 22h26M20 9c4 4 6 8 6 13s-2 9-6 13M20 9c-4 4-6 8-6 13s2 9 6 13"/><path d="M31 30h11M31 36h11M34 24h8"/></svg>`,
  `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 15c2-5 10-4 10 2 0 5-10 11-10 11S14 22 14 17c0-6 8-7 10-2Z"/><circle cx="13" cy="28" r="5"/><circle cx="35" cy="28" r="5"/><circle cx="24" cy="31" r="5"/><path d="M5 43c1-7 6-10 12-10M43 43c-1-7-6-10-12-10M14 43c1-7 5-10 10-10s9 3 10 10"/></svg>`,
  `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 14h28v18H24l-8 7v-7h-6Z"/><path d="M17 22h14M17 27h9"/><circle cx="13" cy="39" r="3"/><circle cx="24" cy="39" r="3"/><circle cx="35" cy="39" r="3"/></svg>`,
  `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 38c-7-4-11-10-11-17 5 0 9 3 11 8 2-5 6-8 11-8 0 7-4 13-11 17Z"/><path d="M24 38c-2-9-1-17 0-27M14 15c5 0 8 3 10 9M34 15c-5 0-8 3-10 9M9 39h30"/></svg>`
];

function t(path) {
  return path.split(".").reduce((acc, key) => acc?.[key], copy[state.lang]) ?? path;
}

function localize(value) {
  return value?.[state.lang] ?? value?.en ?? "";
}

function isBookablePackage(pkg) {
  return ["yunnan-tea-mountain", "guangzhou-chaozhou-haitang-wellness"].includes(pkg.id);
}

function money(value) {
  return new Intl.NumberFormat(state.lang === "zh" ? "zh-CN" : "en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function byId(id) {
  return document.getElementById(id);
}

function applyTranslations() {
  document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const text = t(node.dataset.i18n);
    if (node.dataset.i18n === "hero.title" && state.lang === "zh") {
      const [primary, secondary] = text.split("\n");
      node.innerHTML = `<span class="hero-title-main">${primary}</span><span class="hero-title-sub">${secondary}</span>`;
    } else {
      node.textContent = text;
    }
    node.hidden = text === "";
  });
  document.querySelector("[data-lang-toggle]").textContent = state.lang === "en" ? "中文" : "English";
}

function renderDreams() {
  byId("dream-list").innerHTML = copy[state.lang].dreams.map((item, index) => `
    <article class="dream-item">
      <span class="dream-icon">${dreamIcons[index % dreamIcons.length]}</span>
      <span>${item}</span>
    </article>
  `).join("");
}

function renderServices() {
  byId("service-grid").innerHTML = copy[state.lang].services.items.map(([title, body], index) => `
    <article class="service-item">
      <span class="service-icon" aria-hidden="true">${icons[index]}</span>
      <h3>${title}</h3>
      <p>${body}</p>
    </article>
  `).join("");
}

function filteredPackages() {
  const active = window.GSL_PACKAGES.filter((pkg) => {
    return ["country", "state", "city"].every((key) => {
      return state.filters[key] === "all" || localize(pkg[key]) === state.filters[key];
    });
  });

  return active.sort((a, b) => {
    if (state.filters.sort === "country") return localize(a.country).localeCompare(localize(b.country));
    if (state.filters.sort === "city") return localize(a.city).localeCompare(localize(b.city));
    return 0;
  });
}

function optionList(key) {
  const values = [...new Set(window.GSL_PACKAGES.map((pkg) => localize(pkg[key])))].sort();
  return [`<option value="all">${t("filters.all")}</option>`, ...values.map((value) => `<option value="${value}">${value}</option>`)].join("");
}

function renderFilters() {
  ["country", "state", "city"].forEach((key) => {
    const select = byId(`${key}-filter`);
    const current = state.filters[key];
    select.innerHTML = optionList(key);
    select.value = [...select.options].some((option) => option.value === current) ? current : "all";
    state.filters[key] = select.value;
  });
}

function renderPackages() {
  const packages = filteredPackages();
  byId("package-grid").innerHTML = packages.map((pkg) => `
    <article class="package-card">
      <img src="${pkg.cardImage ?? pkg.image}" alt="${localize(pkg.title)}">
      <div class="package-content">
        <div class="package-meta">
          <span>${localize(pkg.country)} · ${localize(pkg.city)}</span>
          <span>${pkg.durationDays} ${t("card.days")}</span>
        </div>
        <h3>${localize(pkg.title)}</h3>
        <p>${localize(pkg.summary)}</p>
        <div class="tag-row">${pkg.tags[state.lang].map((tag) => `<span>${tag}</span>`).join("")}</div>
        <div class="package-actions">
          <button class="button secondary small" type="button" data-package-detail="${pkg.id}">${t("card.details")}</button>
          ${isBookablePackage(pkg)
            ? `<button class="button primary small" type="button" data-checkout="${pkg.id}">${t("card.checkout")}</button>`
            : `<button class="button primary small" type="button" disabled>${t("card.comingSoon")}</button>`}
        </div>
      </div>
    </article>
  `).join("");
}

function renderPackageDetail(id) {
  const pkg = window.GSL_PACKAGES.find((item) => item.id === id);
  if (!pkg) return;
  byId("package-detail").innerHTML = `
    <div class="detail-layout">
      <div>
        <img class="detail-image" src="${pkg.image}" alt="${localize(pkg.title)}">
        <div class="video-frame">
          ${pkg.video.url ? `<video src="${pkg.video.url}" poster="${pkg.video.poster}" controls></video>` : `<div><span class="play-dot">▶</span><strong>${localize(pkg.video.label)}</strong><small>${t("card.videoReady")}</small></div>`}
        </div>
      </div>
      <div>
        <p class="eyebrow">${localize(pkg.country)} · ${localize(pkg.city)}</p>
        <h2>${localize(pkg.title)}</h2>
        <p>${localize(pkg.summary)}</p>
        <div class="part-list">
          ${pkg.parts.map((part, index) => `
            <article>
              <span>${index + 1}</span>
              <div>
                <h3>${localize(part.title)}</h3>
                <p>${localize(part.description)}</p>
              </div>
            </article>
          `).join("")}
        </div>
        ${isBookablePackage(pkg)
          ? `<button class="button primary" type="button" data-checkout="${pkg.id}">${t("card.checkout")}</button>`
          : `<button class="button primary" type="button" disabled>${t("card.comingSoon")}</button>`}
      </div>
    </div>
  `;
  byId("package-dialog").showModal();
}

function renderCheckout(id) {
  const pkg = window.GSL_PACKAGES.find((item) => item.id === id);
  if (!pkg) return;
  byId("checkout-view").innerHTML = `
    <form class="checkout-form" id="checkout-form">
      <div class="checkout-summary">
        <img src="${pkg.image}" alt="${localize(pkg.title)}">
        <div>
          <p class="eyebrow">${t("checkout.title")}</p>
          <h2>${localize(pkg.title)}</h2>
          <p>${localize(pkg.city)}, ${localize(pkg.country)} · ${pkg.durationDays} ${t("card.days")}</p>
        </div>
      </div>
      <fieldset>
        <legend>${t("checkout.purchaser")}</legend>
        <label><span>${t("checkout.fullName")}</span><input type="text" name="name" required></label>
        <label><span>${t("checkout.email")}</span><input type="email" name="email" required></label>
        <label><span>${t("checkout.travelers")}</span><input type="number" name="travelers" min="1" value="1" required></label>
      </fieldset>
      <fieldset>
        <legend>${t("checkout.payment")}</legend>
        <div class="payment-options" role="radiogroup" aria-label="${t("checkout.provider")}">
          <label><input type="radio" name="provider" value="stripe" checked><span>${t("checkout.stripe")}</span></label>
          <label><input type="radio" name="provider" value="paypal"><span>${t("checkout.paypal")}</span></label>
          <label><input type="radio" name="provider" value="manual"><span>${t("checkout.manual")}</span></label>
        </div>
        <p class="payment-note">${t("checkout.notice")}</p>
      </fieldset>
      <button class="button primary" type="submit">${t("checkout.pay")}</button>
      <p class="form-note" id="checkout-note" role="status"></p>
    </form>
  `;
  byId("checkout-dialog").showModal();
}

function bindEvents() {
  document.querySelector("[data-lang-toggle]").addEventListener("click", () => {
    state.lang = state.lang === "en" ? "zh" : "en";
    renderAll();
  });

  document.querySelector(".nav-toggle").addEventListener("click", (event) => {
    const expanded = event.currentTarget.getAttribute("aria-expanded") === "true";
    event.currentTarget.setAttribute("aria-expanded", String(!expanded));
    document.querySelector(".primary-nav").classList.toggle("open", !expanded);
  });

  ["country", "state", "city", "sort"].forEach((key) => {
    byId(`${key}-filter`).addEventListener("change", (event) => {
      state.filters[key] = event.target.value;
      renderPackages();
    });
  });

  document.body.addEventListener("click", (event) => {
    const detailButton = event.target.closest("[data-package-detail]");
    const checkoutButton = event.target.closest("[data-checkout]");
    const activityVideo = event.target.closest(".activity-video video");

    if (detailButton) renderPackageDetail(detailButton.dataset.packageDetail);
    if (checkoutButton) renderCheckout(checkoutButton.dataset.checkout);
    if (activityVideo) {
      if (activityVideo.paused) activityVideo.play();
      else activityVideo.pause();
    }
  });

  document.querySelector("[data-close-dialog]").addEventListener("click", () => byId("package-dialog").close());
  document.querySelector("[data-close-checkout]").addEventListener("click", () => byId("checkout-dialog").close());

  byId("contact-form").addEventListener("submit", (event) => {
    event.preventDefault();
    byId("contact-note").textContent = t("contact.sent");
    event.currentTarget.reset();
  });

  byId("checkout-dialog").addEventListener("submit", (event) => {
    if (event.target.id !== "checkout-form") return;
    event.preventDefault();
    byId("checkout-note").textContent = t("checkout.success");
  });
}

function renderAll() {
  applyTranslations();
  renderDreams();
  renderServices();
  renderFilters();
  renderPackages();
}

bindEvents();
renderAll();
