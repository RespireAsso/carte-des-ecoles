
class Map{
  constructor(){
    this.zoom = 10;
    this.createLeafletMap();
    this.resizeMap();
    this.initEvents();
  }

  createLeafletMap(){
    this.map = L.map('map', {scrollWheelZoom: true, minZoom: 8}).setView([48.8563687,2.3094096], 10);
    this.map.zoomControl.setPosition('topright');
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
      attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
      minZoom: 1,
      maxZoom: 19
    }).addTo(this.map);
    L.control.locate({ position: 'topright', drawCircle: false }).addTo(this.map);
  }

  initEvents(){
    this.map.on('zoomend', (e) => {
      this.zoom = e.sourceTarget.getZoom();
      World.instance.menu.searchUpdated();
    });
    this.map.on('moveend', (e) => {
      World.instance.menu.searchUpdated();
    });
    $(window).on('orientationchange pageshow resize', () => {
      this.resizeMap();
    });
  }

  fixBound(){
    let minX = 48.8563687;
    let maxX = 48.8563687;
    let minY = 2.3094096;
    let maxY = 2.3094096;
    let database = World.instance.database;
    for (let key in database) {
      let subject = database[key];
      if(subject.x < minX) { minX = subject.x};
      if(subject.y < minY) { minY = subject.y};
      if(subject.x > maxX) { maxX = subject.x};
      if(subject.y > maxY) { maxY = subject.y};
    }
    let min = L.latLng(minX - 2, minY - 2),
    max = L.latLng(maxX + 2, maxY + 2);
    let bounds = L.latLngBounds(min, max);

    this.map.setMaxBounds(bounds);
    this.map.on('drag', () => {
      this.map.panInsideBounds(bounds, { animate: false });
    });
  }

  resizeMap(){
    if(this.map){
      $("#map").width($('.map-container').width());
      this.map.invalidateSize();
    }
  }
}
