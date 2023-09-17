export const HTML: string = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>KBS6 Dev</title>

  <style>
    {{css}}
  </style>
  <style>
    {{animationsCss}}
  </style>
</head>

<body>

  <div class="container">

    <aside class="sidebar">

      <button id="angular">Angular Development</button>
      <button id="angular-deploy">Angular Deploy</button>
      <button id="kbs6-lib">KBS6 Lib</button>
      <button id="lint">Lint</button>
      <button id="kbs-mobile">KBS Mobile</button>

    </aside>

    <main class="main">

      <header class="header">
        <div class="tab active" name="angular-serve">Serve</div>
        <div class="tab" name="angular-test">Test</div>
        <div class="tab" name="angular-build">Build</div>
        <div class="tab" name="angular-build-watch">Build Watch</div>
      </header>

      <pre class="section">
        <code class="language-shell">
        
Initial Chunk Files                                                                                     | Names                     |  Raw Size
vendor.js                                                                                               | vendor                    |   2.93 MB |
polyfills.js                                                                                            | polyfills                 | 317.06 kB |
styles.css, styles.js                                                                                   | styles                    | 256.16 kB |
main.js                                                                                                 | main                      |  14.78 kB |
runtime.js                                                                                              | runtime                   |  14.10 kB |

| Initial Total             |   3.51 MB

Lazy Chunk Files                                                                                        | Names                     |  Raw Size
node_modules_ionic_core_dist_esm_swiper_bundle-28080340_js.js                                           | swiper-bundle-28080340-js | 198.67 kB |
polyfills-core-js.js                                                                                    | polyfills-core-js         | 152.18 kB |
node_modules_ionic_core_dist_esm_ion-datetime_3_entry_js.js                                             | -                         | 135.57 kB |
node_modules_ionic_core_dist_esm_ion-item_8_entry_js.js                                                 | -                         |  99.83 kB |
node_modules_ionic_core_dist_esm_ion-modal_entry_js.js                                                  | -                         |  84.71 kB |
node_modules_ionic_core_dist_esm_ion-app_8_entry_js.js                                                  | -                         |  83.44 kB |
node_modules_ionic_core_dist_esm_ion-popover_entry_js.js                                                | -                         |  65.14 kB |
node_modules_ionic_core_dist_esm_ion-slide_2_entry_js.js                                                | -                         |  60.18 kB |
default-node_modules_ionic_core_dist_esm_data-cb72448c_js-node_modules_ionic_core_dist_esm_th-29e28e.js | -                         |  55.73 kB |
node_modules_ionic_core_dist_esm_ion-refresher_2_entry_js.js                                            | -                         |  54.11 kB |
node_modules_ionic_core_dist_esm_ion-alert_entry_js.js                                                  | -                         |  51.76 kB |
common.js                                                                                               | common                    |  44.84 kB |
node_modules_ionic_core_dist_esm_ion-segment_2_entry_js.js                                              | -                         |  44.04 kB |
src_app_home_home_module_ts.js                                                                          | home-home-module          |  43.65 kB |
node_modules_ionic_core_dist_esm_ion-menu_3_entry_js.js                                                 | -                         |  41.53 kB |
node_modules_ionic_core_dist_esm_ion-button_2_entry_js.js                                               | -                         |  40.52 kB |
node_modules_ionic_core_dist_esm_ion-item-option_3_entry_js.js                                          | -                         |  38.56 kB |
node_modules_ionic_core_dist_esm_ion-range_entry_js.js                                                  | -                         |  37.67 kB |
node_modules_ionic_core_dist_esm_ion-searchbar_entry_js.js                                              | -                         |  36.73 kB |
node_modules_ionic_core_dist_esm_ion-nav_2_entry_js.js                                                  | -                         |  35.86 kB |
node_modules_ionic_core_dist_esm_ion-route_4_entry_js.js                                                | -                         |  35.25 kB |
node_modules_ionic_core_dist_esm_ion-select_3_entry_js.js                                               | -                         |  34.87 kB |
node_modules_ionic_core_dist_esm_ion-action-sheet_entry_js.js                                           | -                         |  33.15 kB |
node_modules_ionic_core_dist_esm_ion-fab_3_entry_js.js                                                  | -                         |  30.20 kB |
node_modules_ionic_core_dist_esm_ion-accordion_2_entry_js.js                                            | -                         |  27.21 kB |
node_modules_ionic_core_dist_esm_ion-tab-bar_2_entry_js.js                                              | -                         |  26.65 kB |
polyfills-dom.js                                                                                        | polyfills-dom             |  26.61 kB |
node_modules_ionic_core_dist_esm_ion-toast_entry_js.js                                                  | -                         |  26.16 kB |
node_modules_ionic_core_dist_esm_ion-input_entry_js.js                                                  | -                         |  25.72 kB |
node_modules_ionic_core_dist_esm_ion-breadcrumb_2_entry_js.js                                           | -                         |  25.35 kB |
node_modules_ionic_core_dist_esm_ion-progress-bar_entry_js.js                                           | -                         |  24.55 kB |
node_modules_ionic_core_dist_esm_ion-picker-internal_entry_js.js                                        | -                         |  23.23 kB |
node_modules_ionic_core_dist_esm_ion-textarea_entry_js.js                                               | -                         |  22.90 kB |
node_modules_ionic_core_dist_esm_ion-toggle_entry_js.js                                                 | -                         |  22.77 kB |
node_modules_ionic_core_dist_esm_ion-picker-column-internal_entry_js.js                                 | -                         |  20.33 kB |
node_modules_ionic_core_dist_esm_ion-radio_2_entry_js.js                                                | -                         |  19.77 kB |
node_modules_ionic_core_dist_esm_ion-back-button_entry_js.js                                            | -                         |  19.66 kB |
node_modules_ionic_core_dist_esm_ion-virtual-scroll_entry_js.js                                         | -                         |  19.38 kB |
node_modules_ionic_core_dist_esm_ion-datetime-button_entry_js.js                                        | -                         |  19.23 kB |
node_modules_ionic_core_dist_esm_input-shims-f2e11980_js.js                                             | input-shims-f2e11980-js   |  18.59 kB |
node_modules_ionic_core_dist_esm_ion-card_5_entry_js.js                                                 | -                         |  18.49 kB |
node_modules_ionic_core_dist_esm_ion-loading_entry_js.js                                                | -                         |  18.08 kB |
node_modules_ionic_core_dist_esm_ion-infinite-scroll_2_entry_js.js                                      | -                         |  15.98 kB |
node_modules_ionic_core_dist_esm_ion-col_3_entry_js.js                                                  | -                         |  15.73 kB |
node_modules_ionic_core_dist_esm_ion-reorder_2_entry_js.js                                              | -                         |  15.31 kB |
node_modules_ionic_core_dist_esm_ion-checkbox_entry_js.js                                               | -                         |  14.10 kB |
node_modules_ionic_core_dist_esm_ion-spinner_entry_js.js                                                | -                         |  10.70 kB |
node_modules_ionic_core_dist_esm_ion-split-pane_entry_js.js                                             | -                         |  10.13 kB |
node_modules_ionic_core_dist_esm_ion-tab_2_entry_js.js                                                  | -                         |   9.73 kB |
node_modules_ionic_core_dist_esm_ion-chip_entry_js.js                                                   | -                         |   8.48 kB |
node_modules_ionic_core_dist_esm_ion-avatar_3_entry_js.js                                               | -                         |   8.23 kB |
node_modules_ionic_core_dist_esm_ion-ripple-effect_entry_js.js                                          | -                         |   6.64 kB |
node_modules_ionic_core_dist_esm_index-2dbe065f_js.js                                                   | index-2dbe065f-js         |   6.28 kB |
node_modules_capacitor-community_barcode-scanner_dist_esm_web_js.js                                     | web                       |   5.25 kB |
node_modules_ionic_core_dist_esm_ion-img_entry_js.js                                                    | -                         |   4.52 kB |
node_modules_ionic_core_dist_esm_ion-text_entry_js.js                                                   | -                         |   4.16 kB |
node_modules_ionic_core_dist_esm_ion-backdrop_entry_js.js                                               | -                         |   3.48 kB |
node_modules_ionic_core_dist_esm_status-tap-4d4674a1_js.js                                              | status-tap-4d4674a1-js    |   2.90 kB |

Build at: 2023-09-17T18:27:39.638Z - Hash: 5b463d1fff12b4c1 - Time: 5407ms

        </code>
      </pre>

    </main>

  </div>

  <script>
    {{iconsVariables}}
  </script>

  <script>
    {{js}}
  </script>
</body>

</html>`;