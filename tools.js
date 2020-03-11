class Tools{
  static createSVGPiechart(city, size = 100){
    let colors = city.colors;
    var newSVG = document.createElement("svg" );
    newSVG.setAttributeNS(null, 'style', "width: " + size + "px; height: " + size + "px;");
    newSVG.setAttributeNS(null, 'viewBox', "-1.2 -1.2 2.4 2.4");
    let cumulativePercent = 0;
    function getCoordinatesForPercent(percent, offset = 0) {
      const x = Math.cos(2 * Math.PI * percent + offset);
      const y = Math.sin(2 * Math.PI * percent + offset);
      return [x, y];
    }
    var midCircle = document.createElement("circle" );
    midCircle.setAttributeNS(null, 'cx', 0);
    midCircle.setAttributeNS(null, 'cy', 0);
    midCircle.setAttributeNS(null, 'r', 1.2);
    midCircle.setAttributeNS(null, 'fill', '#42495B' );
    newSVG.appendChild(midCircle);
    for (var key in colors) {
      let color = colors[key];
      const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
      cumulativePercent += color.percent;
      const [endX, endY] = getCoordinatesForPercent(cumulativePercent, -0.001);
      const largeArcFlag = color.percent > .5 ? 1 : 0;
      const pathData = [
        `M ${startX} ${startY}`,
        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        `L 0 0`,
      ].join(' ');
      const pathEl = document.createElement('path');
      pathEl.setAttribute('d', pathData);
      pathEl.setAttribute('fill', color.color);
      newSVG.appendChild(pathEl);
    }
    return newSVG;
  }
}
