class Building {
  constructor(data) {
    this.data = JSON.parse(JSON.stringify(data));
    this.group = 'none';
    this.zoom = { min: 14, max: 19 };

    this.id = this.data.id;
    this.d = this.data.d;
    this.cp = this.data.cp;
    this.label = this.data.label;
    this.type = this.data.type;
    this.dep = this.data.dep;
    this.city = this.data.city;
    this.x = this.data.x;
    this.y = this.data.y;
  }

  init() {
    let marker = L.marker([this.x, this.y]);
    this.marker = marker;
  }

  get color() {
    let year = World.instance.menu.year;
    let sensor = World.instance.menu.sensor;
    return this.colorFor(year, sensor);
  }

  colorFor(year, sensor) {
    let seuils = World.instance.seuils[sensor];
    let color = 'gray';
    if(this.d[year] && this.d[year][sensor]){
      let value = parseInt(this.d[year][sensor]);
      for (let key in seuils) {
        let seuil = seuils[key];
        let min = seuils[key].min || 0;
        let max = seuils[key].max || 1000;
        if(value >= min && value < max){
          return key;
        }
      }
    }
    return color;
  }

  prepareDisplay(){
    this.setPopup();
    this.setIcon();
    this.setTooltip();
  }

  setTooltip(){
    this.marker.bindTooltip(this.label);
  }

  setPopup(){
    let customOptions = { 'maxWidth': '500', 'className' : 'custom' };
    this.marker.bindPopup(this.popup(), customOptions);
  }

  setIcon(){
    let icon = L.icon({
      iconUrl: `img/${this.color}.svg`, iconSize: [24, 24], iconAnchor: [12, 24], popupAnchor: [1, -12], tooltipAnchor: [1, -15]
    });
    this.marker.setIcon(icon)
  }

  matchText(searchStr){
    if(searchStr == ''){ return true; }
    let string = `${ this.label } ${ this.city } (${ this.dep })`;
    return string.toLowerCase().lastIndexOf(searchStr) != -1;
  }

  matchZoom(){
    let zoom = World.instance.map.zoom;
    return this.zoom.min <= zoom && this.zoom.max >= zoom;
  }

  matchType(){
    let type = World.instance.menu.type;
    return type == 'all' ? true : type == this.type;
  }

  matchThreshold(){
    let threshold = World.instance.menu.threshold;
    if(threshold == 'none'){ return true; }
    return this.color == threshold;
  }

  popup(){
    let c_year = World.instance.menu.year;
    let c_sensor = World.instance.menu.sensor;
    let customPopup = `<b>${ this.label }</b>`;
    customPopup += '<br/>';
    customPopup += `<span class='city'>${ this.city } ( ${ this.dep } )</span>`;
    customPopup += '<br/>';
    customPopup += "<table class='ui very basic collapsing celled unstackable table'>";
    customPopup += '<tr><td></td>';
    for (let year of World.instance.years) {
      customPopup += year == c_year ? `<td><b>${ year }</b></td>` : `<td>${ year }</td>`;
    }
    customPopup += '</tr>';
    for (let sensor of ['no2', 'pm10', 'pm25']) {
      customPopup += '<tr>';
      customPopup += '<td>';
      customPopup += sensor == c_sensor ? `<b>${ this.sensorHTML(sensor) }</b>` : this.sensorHTML(sensor);
      customPopup += '</td>';
      for (let year of World.instance.years) {
        customPopup += `<td class="${ this.colorFor(year, sensor) }">`;
        if (this.d[year][sensor] == 0) {
          customPopup += '<center>-</center>'
        }else{
          customPopup += year == c_year && sensor == c_sensor ? `<b>${ this.d[year][sensor] } ${ World.instance.unit }</b>` : `${ this.d[year][sensor] } ${ World.instance.unit }`;
        }
        customPopup += '</td>';
      }
      customPopup += '</tr>';
    }
    customPopup += '</table>';
    return customPopup;
  }

  sensorHTML(sensor){
    return {
      no2: "NO<sub>2</sub>",
      pm10: "PM<sub>10</sub>",
      pm25: "PM<sub>2.5</sub>"
    }[sensor];
  }
}
