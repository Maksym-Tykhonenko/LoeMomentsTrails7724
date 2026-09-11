// @ts-nocheck
import { WebView } from 'react-native-webview';
import { Image, View } from 'react-native';

const SuglenRdorAnimurn = () => {
  const bgUri = Image.resolveAssetSource(require('../laitassets/lfyimages/loadinggrnd.png')).uri;
  const iconUri = Image.resolveAssetSource(require('../laitassets/lfyimages/loadermoints.png')).uri;

  const starsMarkup = Array.from({ length: 30 })
    .map(() => {
      const size = Math.random() * 3 + 1;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const opacity = Math.random() * 0.7 + 0.1;

      return `<span class="star" style="width:${size}px;height:${size}px;left:${left}%;top:${top}%;opacity:${opacity};"></span>`;
    })
    .join('');

  const rendhtmlcode = `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <style>
        :root {
          color-scheme: dark;
        }
        * {
          box-sizing: border-box;
        }
        html, body {
          margin: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif;
          background: #060914;
        }
        .root {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(6,9,20,0.55) 0%, rgba(6,9,20,0.7) 100%);
        }
        .stars {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .star {
          position: absolute;
          border-radius: 999px;
          background: #C9A84C;
        }
        .content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          padding: 16px;
        }
        .ring-wrap {
          position: relative;
          width: 130px;
          height: 130px;
          display: grid;
          place-items: center;
        }
        .ring-outer {
          position: absolute;
          inset: 0;
          border: 1.5px dashed rgba(201,168,76,0.4);
          border-radius: 999px;
        }
        .ring-inner {
          position: absolute;
          width: 110px;
          height: 110px;
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 999px;
        }
        .orbit-dot {
          position: absolute;
          top: -4px;
          left: 50%;
          width: 8px;
          height: 8px;
          transform: translateX(-50%);
          border-radius: 999px;
          background: #C9A84C;
          box-shadow: 0 0 10px #C9A84C, 0 0 20px rgba(201,168,76,0.5);
        }
        .logo {
          width: 80px;
          height: 80px;
          border-radius: 22px;
          overflow: hidden;
        }
        .logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .title {
          color: #EAE8DF;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: 1px;
          text-align: center;
          margin: 0;
        }
        .subtitle {
          margin: 4px 0 0;
          color: #C9A84C;
          font-size: 13px;
          letter-spacing: 3px;
          text-transform: uppercase;
          text-align: center;
        }
        .progress-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .progress-track {
          width: 200px;
          height: 2px;
          background: rgba(255,255,255,0.12);
          border-radius: 4px;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          width: 0%;
          border-radius: 4px;
          background: linear-gradient(90deg, #7455B8, #C9A84C);
        }
        .hint {
          color: rgba(234,232,223,0.5);
          font-size: 11px;
          letter-spacing: 1px;
          margin: 0;
        }
      </style>
    </head>
    <body>
      <div class="root">
        <img class="bg" src="${bgUri}" alt="" />
        <div class="shade"></div>
        <div class="stars">${starsMarkup}</div>

        <div class="content">
          <div class="ring-wrap">
            <div class="ring-outer"></div>
            <div class="ring-inner"></div>
            <div class="orbit-dot"></div>
            <div class="logo"><img src="${iconUri}" alt="Photo Trails" /></div>
          </div>

          <div>
            <h1 class="title">Photo Trails</h1>
            <p class="subtitle">Lodestar Moments</p>
          </div>

          <div class="progress-wrap">
            <div class="progress-track"><div id="progressBar" class="progress-bar"></div></div>
            <p class="hint">Mapping your trail...</p>
          </div>
        </div>
      </div>

      <script>
        (function () {
          var progress = 0;
          var bar = document.getElementById('progressBar');
          var interval = setInterval(function () {
            progress = Math.min(100, progress + 1.5);
            if (bar) {
              bar.style.width = progress + '%';
            }
            if (progress >= 100) {
              clearInterval(interval);
            }
          }, 35);
        })();
      </script>
    </body>
    </html>
  `;

  return (
    <View style={{ flex: 1, margin: 0, padding: 0, backgroundColor: '#060914' }}>
      <WebView
        source={{ html: rendhtmlcode }}
        originWhitelist={['*']}
        scrollEnabled={false}
        bounces={false}
        domStorageEnabled={true}
        javaScriptEnabled={true}
        style={{ flex: 1, margin: 0, padding: 0, backgroundColor: '#060914' }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default SuglenRdorAnimurn;