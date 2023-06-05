import React, { useRef, useEffect, useState } from 'react'
import pdfjs from 'pdfjs-dist';
import { useKeyPress } from '@umijs/hooks';
import { PDFLinkService, PDFFindController, PDFViewer, DownloadManager } from 'pdfjs-dist/web/pdf_viewer';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import 'pdfjs-dist/web/pdf_viewer.css';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// 显示文字类型 0 不显示 1 显示 2 启用增强
const TEXT_LAYER_MODE = 0;
// 是否通过CSS控制放大缩小 true false
const USE_ONLY_CSS_ZOOM = true

const Index = props => {
  const containerRef = useRef(null);

  const [viewer = {}, setViewer] = useState({});
  const [scale = 1, setScale] = useState("page-fit");
  const [searcher = {}, setSearcher] = useState({
    phraseSearch: true,
    query: '',
    findPrevious: true,
    highlightAll: true,
  });

  // 渲染页面
  const initialViewer = (url) => {
    const linkService = new PDFLinkService();
    const findController = new PDFFindController({
      linkService,
    });
    const newViewer = new PDFViewer({
      container: containerRef.current,
      linkService,
      useOnlyCssZoom: USE_ONLY_CSS_ZOOM,
      textLayerMode: TEXT_LAYER_MODE,
      // renderer:'svg',
      scale: scale,
      findController,

    });
    linkService.setViewer(newViewer);
    // 设置初始缩放
    newViewer.currentScaleValue = scale;

    const loadingTask = pdfjs.getDocument({ url });
    loadingTask.promise.then(pdf => {
      if (pdf) {
        const nums = pdf.numPages
        // setNumPages(nums)
        newViewer.setDocument(pdf);
        linkService.setDocument(pdf);
        setViewer(newViewer)

        // 判断是否已经渲染完毕
        const interval = setInterval(() => { loadPdf() }, 10);

        function loadPdf() {
          if (newViewer.pageViewsReady) {
            // // 暂时没有用到
            const pdfDom = document.getElementById('innerContainer')
            const pageData = []
            pdfDom.childNodes.forEach((item, index) => {
              pageData.push({
                div: item,
                id: index
              })
            })
            newViewer.currentScaleValue = scale;
            clearInterval(interval);
          }
        }
      }
    })
  }

  const { url } = props

  useEffect(() => {
    if (url) {
      initialViewer(url)
    }
  }, [url])

  useKeyPress('enter', event => {
    viewer.findController.executeCommand('findagain', searcher);
  });

  const getPageStyle = (div) => {
    const demo = window.getComputedStyle(div, null);
    let divStyles = {}
    Object.keys(demo).forEach(key => {

      if (`${key}` !== '0' && !parseInt(key) && demo[key]) {
        divStyles = {
          ...divStyles,
          [`${key}`]: demo[key]
        }
      }
    })
    return divStyles
  }

  return (
    <div className="viewer">
      <div
        id="viewerContainer"
        className="viewerContainer"
        ref={containerRef}
      >
        <div
          className="pdfViewer"
          id="innerContainer"
        />
      </div>

    </div>
  )
}

Index.displayName = "PDFViewer"

export default Index;