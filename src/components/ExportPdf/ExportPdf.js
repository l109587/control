import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * 导出PDF
 * @param {导出后的文件名} title 
 * @param {要导出的dom节点：react使用ref} ele 
 */
export default async function  exportPDF(title, ele, isPrint = '', paperDirection = 'l') {
  const PDFFile = {
    A4:['592.28', '841.89'],
  }
  // 根据dpi放大，防止图片模糊
  const scale = window.devicePixelRatio > 1 ? window.devicePixelRatio : 2;
  // 下载尺寸 a4 纸 比例  p 纵向  l 横向
  let pdf = new jsPDF(paperDirection, 'pt', 'a4');
  let width = ele.offsetWidth;
  let height = ele.offsetHeight;

  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  var contentWidth = canvas.width;
  var contentHeight = canvas.height;

  //一页pdf显示html页面生成的canvas高度;
  var pageHeight=(PDFFile.A4[1]/PDFFile.A4[0]) * contentWidth;
  // var pageHeight = contentWidth / PDFFile.A4[0] * PDFFile.A4[1];
  //未生成pdf的html页面高度
  var leftHeight = contentHeight;
  //页面偏移
  var position = 0;
  //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
  var imgWidth = '';
  var imgHeight = ''
  if(paperDirection == 'l'){
    imgWidth = PDFFile.A4[1];
    // imgHeight = PDFFile.A4[0] / contentWidth * contentHeight;
    imgHeight = (contentHeight / contentWidth ) * PDFFile.A4[0] ;
  }else {
    imgWidth = PDFFile.A4[0];
    imgHeight = (contentHeight / contentWidth ) * PDFFile.A4[0] ;
  }
  
  const pdfCanvas = await  html2canvas(ele, {
    useCORS: true,
    canvas,
    scale,
    width,
    height,
    x: 0,
    y: 0,
  });
  const imgDataUrl = pdfCanvas.toDataURL();
  if (leftHeight < pageHeight) {
    pdf.addImage(imgDataUrl, 'png', 0, 0, imgWidth, imgHeight);
  } else {    // 分页
    while (leftHeight > 0) {
      pdf.addImage(imgDataUrl, 'png', 0, position, imgWidth, imgHeight);
      if(paperDirection == 'l'){
        position -= PDFFile.A4[1];
      }else {
        position -= PDFFile.A4[1];
      }
      leftHeight -= pageHeight;
      //避免添加空白页
      if (leftHeight > 0) {
        await  pdf.addPage();
      }
    }
  }
      if (isPrint) {
      //打印
      const link = window.URL.createObjectURL(pdf.output('blob'));
      window.open(link);
    } else {
      //下载
      pdf.save(`${title}.pdf`);
    }
  // 导出下载 

}
