import {
  wrapPageElement as _wrapPageElement,
} from './src/utils/providers';

export const wrapPageElement = _wrapPageElement;

export const onRouteUpdate = () => {
  window.navigator.serviceWorker.register('/sw.js').then((reg) => {
    reg.update();
  });
};

// trigger an immediate page refresh when an update is found
export const onServiceWorkerUpdateReady = () => {
  console.log('update found, reload the page');
  window.location.reload(true);
};

export const onClientEntry = () => {
  try {
    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      // Lazy configure react-pdf worker on client only
      // eslint-disable-next-line global-require
      const reactPdf = require('react-pdf');
      if (reactPdf && reactPdf.pdfjs && reactPdf.pdfjs.GlobalWorkerOptions) {
        reactPdf.pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${reactPdf.pdfjs.version}/pdf.worker.js`;
      }
    }
  } catch (e) {
    // ignore
  }
};