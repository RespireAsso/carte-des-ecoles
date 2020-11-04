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
    $.getJSON("data/data2019.json", (raw, status) => {
      this.transformRawData(raw);
      this.onDataReady();
    });
  }

  transformRawData(raw) {
    for (let key in raw) {
      let json = raw[key];
      let city_key = json.dep + ":" + json.city
      if(!this.database[city_key]){
        this.database[city_key] = new City(json);
      }
      let building = new Building(json);
      this.database[key] = building;
      this.database[city_key].childs.push(building);
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
    return ['2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019'];
  }

  get seuils(){
    return {
      pm10: { bon: { max: 20 }, moyen: { min: 20, max: 40}, degrade: { min: 40, max: 50 }, mauvais: { min: 50, max: 100 }, tres_mauvais: { min: 100 } },
      pm25: { bon: { max: 10 }, moyen: { min: 10, max: 20}, degrade: { min: 20, max: 25 }, mauvais: { min: 25, max:  50 }, tres_mauvais: { min:  50 } },
      no2:  { bon: { max: 40 }, moyen: { min: 40, max: 90}, degrade: { min: 90, max: 120 }, mauvais: { min: 120, max: 230 }, tres_mauvais: { min: 230 } },
    };
  }

  get unit(){
    return "µg/m<sup>3</sup>";
  }
}
