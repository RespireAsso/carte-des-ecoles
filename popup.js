class Popup {
  constructor(){
    this.open();
  }

  open(){
    $('.first.modal').modal('setting', 'transition', 'vertical flip').modal('show');
    $('.info.item').popup({ on: 'hover' });
    $('.steps .step').tab();
  }

  goto(tab){
    $('.steps .step').tab('change tab', tab);
  }

  close(){
    $('.first.modal').modal('hide');
  }
}
