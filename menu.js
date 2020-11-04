class Menu {
  constructor(){
    this.type = 'all';
    this.year = '2018';
    this.threshold = 'none';
    this.sensor = 'no2';
    this.menuIsToggle = false;
    this.list = [];
    this.updateLegend();
    $('.toggle-menu').click(() => { this.toggleMenu(); });
    $('.info.circle').popup({ on: 'hover' });
    $('input').on('input', () => { this.searchUpdated(); });
  }

  get searchStr(){
    return $('#search').val().toLowerCase();
  }

  searchUpdated(){
    let searchStr = this.searchStr;
    setTimeout(()=>{
      if(searchStr == this.searchStr){
        $('.tiny.progress').fadeTo(0,1);
        $('.tiny.progress').progress('reset');
        this.search();
      }
    }, 100);
  }

  search(){
    this.queue = Object.keys(World.instance.database);
    this.list = [];
    if(!this.interval){
      this.interval = setInterval(()=>{ this.unQueueFilter() }, 0);
    }
  }

  unQueueFilter(){
    let searchStr = this.searchStr;
    let type = this.type;
    let database = World.instance.database;
    this.queue.splice(0, 300).forEach((key)=>{
      this.filter(database[key], type, searchStr);
    });
    $('.tiny.progress').progress({ percent: ((Object.keys(database).length - this.queue.length) / Object.keys(database).length)*100 });
    if(this.queue.length == 0){
      clearInterval(this.interval);
      this.interval = null;
      $('.tiny.progress').fadeTo(1000,0, ()=>{ $('.tiny.progress').progress('reset'); });
      this.updateDisplayList();
    }
  }

  updateDisplayList(){
    let year = this.year;
    let sensor = this.sensor;
    this.list = this.list.sort(function(a, b) {
      return b.d[year][sensor] - a.d[year][sensor];
    });
    $('.list').empty();
    if(this.list.length == 0){
      $('.list').append("<div style='padding: 1em; text-align:center;'>Aucun résultat</div>");
    }else{
      let html = "<table class='ui collapsing celled selectable unstackable table list'>";
      for (let i = 0; i < 100; i++) {
        let subject = this.list[i];
        if(subject){
          html += `<tr onClick="World.instance.zoomOn('${ subject.id }')"><td>${ subject.label }<br><i>${ subject.city } ( ${ subject.dep  } )</i></td>`
          html += `<td class='value ${ subject.color }'>${ subject.d[year][sensor] } ${ World.instance.unit }</td></tr>`
        }
      }
      html += "</table>";
      $('.list').append(html);
    }
  }

  filter(subject, type, searchStr){
    let map = World.instance.map.map;
    let inList = subject.matchText(searchStr) && subject.matchType() && subject.matchThreshold(subject);
    if(inList && subject.group == 'none'){
      this.list.push(subject);
    }
    if(subject.matchZoom() && inList){
      subject.prepareDisplay();
      let bounds = map.getBounds();
      if(!subject.visible && bounds.contains(subject.marker.getLatLng())){
        subject.visible = true;
        map.addLayer(subject.marker);
      }
    }else{
      if(subject.visible){
        subject.visible = false;
        map.removeLayer(subject.marker);
      }
    }
  }

  toggleMenu(){
    this.menuIsToggle = !this.menuIsToggle
    if(this.menuIsToggle){
      $('.box-menu').animate({left: 0}, 500 );
      $('#nav-icon').addClass('open');
    }else{
      $('.box-menu').animate({left: -300}, 500 );
      $('#nav-icon').removeClass('open');
    }
  }

  updateLegend(){
    let labels = {
      green:  'Correct',
      yellow: 'Juste en dessous des recommandations OMS',
      red: 'Au delà des recommandations OMS',
      black:    'Très préoccupant'
    };
    $('.legend').empty();
    let html = '';
    let seuils = World.instance.seuils[this.sensor];
    for (let key in seuils) {
      let seuil = seuils[key];
      let text = 'valeur';
      if(seuil.min){
        text = `${seuil.min} &le; ${text}`;
      }
      if(seuil.max){
        text = `${text} &lt; ${seuil.max}`;
      }
      html += `<div><div class="${key}"></div><b>${labels[key]}</b> <i>(${text})</i></div>`
    }
    $('.legend').append(html);
  }

  setType(value, elt){
    $(elt).parent().children().removeClass('active');
    $(elt).addClass('active');
    this.type = value;
    this.searchUpdated();
  }

  setThreshold(value, elt){
    $(elt).parent().children().removeClass('active');
    $(elt).addClass('active');
    this.threshold = value;
    this.searchUpdated();
  }

  setYear(value, elt){
    $(elt).parent().children().removeClass('active');
    $(elt).addClass('active');
    this.year = value;
    this.searchUpdated();
  }

  setSensor(value, elt){
    $(".sensor .item").removeClass('active');
    $(`.sensor .item.${value}`).addClass('active');
    this.sensor = value;
    this.updateLegend();
    this.searchUpdated();
  }
}
