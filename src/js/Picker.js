
const PickerHTML = [

  '<div class="picker">',
    '<div class="picker__label"></div>',
    '<div class="picker__value"></div>',
    '<div class="picker__list"></div>',
  '</div>',

].join( '\n' );

document.querySelectorAll( 'picker' ).forEach( el => {

  const temp = document.createElement( 'div' );
  temp.innerHTML = PickerHTML;

  const picker = temp.querySelector( '.picker' );
  const pickerLabel = picker.querySelector( '.picker__label' );
  const pickerList = picker.querySelector( '.picker__list' );

  picker.setAttribute( 'name', el.getAttribute( 'name' ) );
  pickerLabel.innerHTML = el.getAttribute( 'title' );

  if ( el.hasAttribute( 'list' ) ) {

    el.getAttribute( 'list' ).split( ',' ).forEach( listItemText => {

      const listItem = document.createElement( 'div' );
      listItem.innerHTML = listItemText;
      pickerList.appendChild( listItem );

    } );

  }

  el.parentNode.replaceChild( picker, el );

} );

class Picker {

  constructor( name, options ) {

    options = Object.assign( {
      value: 0,
      onUpdate: () => {},
      onComplete: () => {},
    }, options || {} );

    this.element = document.querySelector( '.picker[name="' + name + '"]' );
    this.label = this.element.querySelector( '.picker__label' );
    this.valueDisplay = this.element.querySelector( '.picker__value' );
    this.list = this.element.querySelector( '.picker__list' );
    this.items = [].slice.call( this.element.querySelectorAll( '.picker__list div' ) );

    this.value = options.value;
    this.onUpdate = options.onUpdate;
    this.onComplete = options.onComplete;

    this.initInteraction();
    this.setValue( this.value );

  }

  setValue( value ) {

    this.value = value;
    
    // Update display text
    if ( this.items[ this.value ] ) {
      this.valueDisplay.innerHTML = this.items[ this.value ].innerHTML;
    }

    // Highlight selected item in list
    this.items.forEach( ( item, i ) => {
      if ( i === this.value ) item.classList.add( 'active' );
      else item.classList.remove( 'active' );
    });

  }

  initInteraction() {

    this.valueDisplay.addEventListener( 'click', () => {
      this.toggleList();
    });

    this.items.forEach( ( item, index ) => {
      item.addEventListener( 'click', () => {
        this.setValue( index );
        this.hideList();
        this.onUpdate( this.value );
        this.onComplete( this.value );
      });
    });

    // Close when clicking outside
    document.addEventListener( 'click', ( e ) => {
      if ( ! this.element.contains( e.target ) ) {
        this.hideList();
      }
    });

  }

  toggleList() {
    this.element.classList.toggle( 'picker--open' );
  }

  showList() {
    this.element.classList.add( 'picker--open' );
  }

  hideList() {
    this.element.classList.remove( 'picker--open' );
  }

}

export { Picker };
