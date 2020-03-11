class World {
  constructor() {}

  static get instance(){
    if(this._instance){
      return this._instance;
    }
    return this._instance = new World();
  }

  init(){
    this.menu = new Menu();
    this.map = new Map();
    this.popup = new Popup();
    this.computeDatabase();
  }

  onDataReady(){
    //this.map.fixBound();
    this.menu.searchUpdated();
    $(".loading").removeClass('active')
  }

  computeDatabase(){
    this.database = {};
    $.getJSON("data/data2018.json", (raw, status) => {
      this.transformRawData(raw);
      this.onDataReady();
    });
  }

  transformRawData(raw) {
    for (let key in raw) {
      let json = raw[key];
      if(!this.database[json.city]){
        this.database[json.city] = new City(json);
      }
      let building = new Building(json);
      this.database[key] = building;
      this.database[json.city].childs.push(building);
    }
    for (let key in this.database) {
      let subject = this.database[key];
      subject.init();
    }
  }

  zoomOn(id){
    let marker = this.database[id].marker;
    this.map.map.setView(marker.getLatLng(), 17);
    marker.openPopup();
  }

  get years(){
    return ['2012', '2013', '2014', '2015', '2016', '2017', '2018'];
  }

  get seuils(){
    return {
      pm10: { green: { max: 20 }, yellow: { min: 20, max: 40}, red: { min: 40, max: 60 }, black: { min: 60 }},
      pm25: { green: { max: 10 }, yellow: { min: 10, max: 20}, red: { min: 20, max: 30 }, black: { min: 30 }},
      no2:  { green: { max: 40 }, yellow: { min: 40, max: 50}, red: { min: 50, max: 60 }, black: { min: 60 }}
    };
  }

  get unit(){
    return "µg/m<sup>3</sup>";
  }
}
