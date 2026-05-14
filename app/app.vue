<template>
  <main class="app-shell" :lang="locale">
    <section class="control-surface">
      <div class="topbar">
        <div>
          <p class="eyebrow">{{ copy.eyebrow }}</p>
          <h1>{{ copy.title }}</h1>
        </div>
        <div class="locale-switch" :aria-label="copy.language">
          <button
            v-for="option in localeOptions"
            :key="option.value"
            type="button"
            :class="{ active: locale === option.value }"
            @click="locale = option.value"
          >
            {{ option.label }}
          </button>
        </div>
      </div>

      <div class="workspace">
        <section class="panel primary-panel">
          <div class="status-row">
            <div>
              <p class="label">{{ copy.status }}</p>
              <strong>{{ enabled ? copy.enabled : copy.disabled }}</strong>
            </div>
            <button class="power-button" type="button" :class="{ active: enabled }" @click="toggleDefocus">
              {{ enabled ? copy.turnOff : copy.turnOn }}
            </button>
          </div>

          <div class="slider-grid">
            <label>
              <span>{{ copy.strength }}</span>
              <strong>{{ settings.strengthPercent }}%</strong>
              <input v-model.number="settings.strengthPercent" type="range" min="10" max="80" step="5">
            </label>

            <label>
              <span>{{ copy.distance }}</span>
              <strong>{{ settings.distanceCm }} cm</strong>
              <input v-model.number="settings.distanceCm" type="range" min="30" max="90" step="5">
            </label>

            <label>
              <span>{{ copy.diagonal }}</span>
              <strong>{{ settings.diagonalInch }}"</strong>
              <input v-model.number="settings.diagonalInch" type="range" min="11" max="32" step="1">
            </label>
          </div>

          <div class="resolution-grid">
            <label>
              <span>{{ copy.resX }}</span>
              <input v-model.number="settings.resX" type="number" min="640" step="10">
            </label>
            <label>
              <span>{{ copy.resY }}</span>
              <input v-model.number="settings.resY" type="number" min="480" step="10">
            </label>
          </div>
        </section>

        <section class="panel preview-panel">
          <p class="label">{{ copy.preview }}</p>
          <h2>{{ copy.previewTitle }}</h2>
          <p>{{ copy.previewBody }}</p>
          <div class="sample-lines">
            <span v-for="line in 6" :key="line" />
          </div>
        </section>
      </div>

      <div class="footer-row">
        <div class="github-hover">
          <a href="https://github.com/refractify/myopic_defocus" target="_blank" rel="noopener noreferrer">
            {{ copy.upstream }}
          </a>
          <p>{{ copy.upstreamTip }}</p>
        </div>
        <small>{{ copy.note }}</small>
      </div>
    </section>

    <MyopicDefocusLayer
      :enabled="enabled"
      :strength-percent="settings.strengthPercent"
      :distance-cm="settings.distanceCm"
      :diagonal-inch="settings.diagonalInch"
      :res-x="settings.resX"
      :res-y="settings.resY"
    />

    <div v-if="extensionNotice" class="modal-backdrop" role="dialog" aria-modal="true">
      <div class="modal">
        <h2>{{ copy.extensionTitle }}</h2>
        <p>{{ copy.extensionBody }}</p>
        <button type="button" @click="extensionNotice = false">{{ copy.ok }}</button>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
type Locale = "zh" | "en" | "ja";

const STORAGE_KEY = "myopic-defocus-nuxt-settings";

const localeOptions: Array<{ value: Locale; label: string }> = [
  { value: "zh", label: "中" },
  { value: "en", label: "EN" },
  { value: "ja", label: "日" }
];

const messages = {
  zh: {
    language: "语言",
    eyebrow: "Nuxt Visual Layer",
    title: "近视散焦网页层",
    status: "当前状态",
    enabled: "散焦层已开启",
    disabled: "散焦层未开启",
    turnOn: "开启散焦",
    turnOff: "关闭散焦",
    strength: "效果强度",
    distance: "观看距离",
    diagonal: "屏幕尺寸",
    resX: "横向分辨率",
    resY: "纵向分辨率",
    preview: "预览区域",
    previewTitle: "给屏幕覆盖一层可调节的近视散焦效果",
    previewBody: "它会拆分颜色通道并对绿、蓝通道进行轻微模糊，用于缓解眼部疲劳、帮助眼睛放松。",
    upstream: "查看 Refractify 项目",
    upstreamTip: "此功能参考 GPL 项目 Refractify Myopic Defocus，并改造成 Nuxt 页面组件。",
    note: "实验性视觉舒适工具，不构成医疗建议。",
    extensionTitle: "已检测到浏览器扩展",
    extensionBody: "当前页面似乎已经存在 Refractify 扩展注入的散焦层，因此不再重复开启站内效果。",
    ok: "知道了"
  },
  en: {
    language: "Language",
    eyebrow: "Nuxt Visual Layer",
    title: "Myopic Defocus Web Layer",
    status: "Status",
    enabled: "Defocus layer is on",
    disabled: "Defocus layer is off",
    turnOn: "Enable defocus",
    turnOff: "Disable defocus",
    strength: "Effect strength",
    distance: "Viewing distance",
    diagonal: "Screen size",
    resX: "Horizontal resolution",
    resY: "Vertical resolution",
    preview: "Preview",
    previewTitle: "A tunable myopic defocus layer for the screen",
    previewBody: "It splits color channels and gently blurs green and blue channels, aiming to reduce eye strain and help your eyes relax.",
    upstream: "View Refractify project",
    upstreamTip: "This feature is adapted from the GPL project Refractify Myopic Defocus and repackaged as a Nuxt page component.",
    note: "Experimental visual comfort tool. Not medical advice.",
    extensionTitle: "Browser extension detected",
    extensionBody: "This page already appears to have a Refractify extension defocus layer, so the built-in page effect will not be enabled again.",
    ok: "Got it"
  },
  ja: {
    language: "言語",
    eyebrow: "Nuxt Visual Layer",
    title: "近視性デフォーカス Web レイヤー",
    status: "現在の状態",
    enabled: "デフォーカス層は有効です",
    disabled: "デフォーカス層は無効です",
    turnOn: "有効にする",
    turnOff: "無効にする",
    strength: "効果の強さ",
    distance: "視聴距離",
    diagonal: "画面サイズ",
    resX: "横解像度",
    resY: "縦解像度",
    preview: "プレビュー",
    previewTitle: "画面に調整可能な近視性デフォーカスを重ねる",
    previewBody: "色チャンネルを分け、緑と青のチャンネルを軽くぼかします。目の疲れを和らげ、目を休ませることを目的にしています。",
    upstream: "Refractify プロジェクトを見る",
    upstreamTip: "この機能は GPL プロジェクト Refractify Myopic Defocus を参考にし、Nuxt コンポーネントとして作り直したものです。",
    note: "実験的な視覚快適ツールです。医療アドバイスではありません。",
    extensionTitle: "ブラウザー拡張機能を検出しました",
    extensionBody: "このページには Refractify 拡張機能のデフォーカス層がすでにあるようです。サイト内の効果は重ねて有効にしません。",
    ok: "了解"
  }
} as const;

const locale = ref<Locale>("zh");
const enabled = ref(false);
const extensionNotice = ref(false);
const settings = reactive({
  strengthPercent: 40,
  distanceCm: 40,
  diagonalInch: 14,
  resX: 2560,
  resY: 1440
});

const copy = computed(() => messages[locale.value]);

const hasExternalRefractifyLayer = () => {
  const isOwnElement = (element: Element | null) => element?.getAttribute("data-myopic-defocus-nuxt") === "true";
  const layer = document.getElementById("blurLayer");
  const filter = document.getElementById("RefractifyBlending1");
  const styledLayer = [...document.querySelectorAll('[style*="RefractifyBlending1"]')]
    .some((element) => !isOwnElement(element));

  return Boolean(
    (layer && !isOwnElement(layer))
    || (filter && !isOwnElement(filter))
    || styledLayer
  );
};

const toggleDefocus = () => {
  if (!enabled.value && hasExternalRefractifyLayer()) {
    extensionNotice.value = true;
    return;
  }

  enabled.value = !enabled.value;
};

watch([locale, enabled, settings], () => {
  if (!import.meta.client) return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    locale: locale.value,
    enabled: enabled.value,
    settings: { ...settings }
  }));
}, { deep: true });

onMounted(() => {
  settings.resX = window.screen.width * window.devicePixelRatio;
  settings.resY = window.screen.height * window.devicePixelRatio;

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (["zh", "en", "ja"].includes(parsed.locale)) locale.value = parsed.locale;
      if (typeof parsed.enabled === "boolean") enabled.value = parsed.enabled;
      if (parsed.settings && typeof parsed.settings === "object") Object.assign(settings, parsed.settings);
    } catch {}
  }

  if (enabled.value && hasExternalRefractifyLayer()) {
    enabled.value = false;
    extensionNotice.value = true;
  }
});
</script>
