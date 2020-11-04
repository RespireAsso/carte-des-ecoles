class City {
  constructor(data) {
    this.data = JSON.parse(JSON.stringify(data));
    this.group = 'city';
    this.zoom = { min: 0, max: 13 };
    this.childs = [];

    this.label = this.data.city;

    this.cp = this.data.cp;
    this.type = this.data.type;
    this.dep = this.data.dep;
    this.city = this.data.city;
    this.x = this.data.x;
    this.y = this.data.y;
  }

  init() {
    this.calculateXY();
    let marker = L.marker([this.x, this.y]);
    this.marker = marker;
  }

  calculateXY(){
    let x = 0;
    let y = 0;
    this.childs.forEach((child)=>{
      x += child.x;
      y += child.y;
    });
    this.x = x / this.childs.length;
    this.y = y / this.childs.length;
  }

  get colors(){
    let colors = {
      green:  { percent: 0, color: '#54cb71', total: 0, label: 'Correct'},
      yellow: { percent: 0, color: '#f1c40e', total: 0, label: 'Juste en dessous des recommandations OMS'},
      red:    { percent: 0, color: '#e74c3b', total: 0, label: 'Au delà des recommandations OMS'},
      black:  { percent: 0, color: 'black', total: 0, label: 'Très préoccupant'}
    };
    this.childs.forEach((child)=>{
      let color = child.color;
      colors[color].percent += 1 / this.childs.length;
      colors[color].total += 1;
      if(colors[color].percent > 1){
        colors[color].percent = 1;
      }
    });
    return colors;
  }

  prepareDisplay(){
    this.setPopup();
    this.setIcon();
    this.setTooltip();
  }

  setTooltip(){
    this.marker.bindTooltip(this.city);
  }

  setPopup(){
    let customOptions = { 'maxWidth': '500', 'className' : 'custom' };
    this.marker.bindPopup(this.popup(), customOptions);
  }

  setIcon(){
    let zoom = World.instance.map.zoom;
    let size = { 10: 24, 11: 36, 12: 48, 13: 64 }[zoom] || 16;
    let svg = '';
    svg = Tools.createSVGPiechart(this, size);
    svg = svg.outerHTML;
    svg = svg.replace('<svg', "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1'");
    svg = encodeURIComponent(svg);
    //svg = window.btoa(svg)
    let iconUrl = `data:image/svg+xml;utf8,${svg}`;
    let icon = L.icon({
      iconUrl: iconUrl, iconSize: [size, size], iconAnchor: [size/2, size/2], popupAnchor: [0, 0], tooltipAnchor: [0, -0]
    });
    this.marker.setIcon(icon)
  }

  matchText(searchStr){
    return this.childs.some((child) => { return child.matchText(searchStr); });
  }

  matchZoom(){
    let zoom = World.instance.map.zoom;
    return this.zoom.min <= zoom && this.zoom.max >= zoom;
  }

  matchType(){
    let type = World.instance.menu.type;
    return type == 'all' ? true : this.childs.some((child) => { return child.type == type; });
  }

  matchThreshold(){
    let threshold = World.instance.menu.threshold;
    if(threshold == 'none'){ return true; }
    return this.childs.some((child) => { return child.color == threshold });
  }

  popup(){
    let customPopup = `<b>${ this.city } ${ this.cp  }</b>`;
    customPopup += '<br/>';
    customPopup += `<span class='city'>Nombre d'établissements: ${ this.childs.length }</span>`;
    customPopup += '<br/>';
    let svg = Tools.createSVGPiechart(this, 100);
    customPopup += '<br/>';
    customPopup += '<table><tr><td style="padding-right: 2em;">' + svg.outerHTML + '</td><td>';
    customPopup += "<table class='ui very basic collapsing celled unstackable table'>";
    let colors = this.colors;
    for (var key in colors) {
      let color = colors[key];
      customPopup += `<tr><td>${color.label}</td><td>${color.total} (${Math.floor(color.percent*100)}%)</td>`;
    }
    customPopup += "</table>";
    customPopup += '</td></tr></table>';
    customPopup += '</div>';
    return customPopup;
  }
}
