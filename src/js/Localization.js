export class Localization {

  constructor( game ) {

    this.game = game;
    this.dictionaries = {
      'en': {
        'title': 'THE CUBE',
        'note': 'Double tap to start',
        'timer': '0:00',
        'complete': 'Complete!',
        'best-time': 'Best Time!',
        'cube-size': 'Cube Size',
        'flip-type': 'Flip Type',
        'scramble-length': 'Scramble Length',
        'camera-angle': 'Camera Angle',
        'color-scheme': 'Color Scheme',
        'hue': 'Hue',
        'saturation': 'Saturation',
        'lightness': 'Lightness',
        'stats-cube': 'Cube:',
        'stats-total-solves': 'Total solves:',
        'stats-best-time': 'Best time:',
        'stats-worst-time': 'Worst time:',
        'stats-average-5': 'Average of 5:',
        'stats-average-12': 'Average of 12:',
        'stats-average-25': 'Average of 25:',
        'pref-flip-swift': 'Swift',
        'pref-flip-smooth': 'Smooth',
        'pref-flip-bounce': 'Bounce',
        'pref-view-ortho': 'Ortographic',
        'pref-view-persp': 'Perspective',
        'pref-theme-cube': 'Cube',
        'pref-theme-erno': 'Erno',
        'pref-theme-dust': 'Dust',
        'pref-theme-camo': 'Camo',
        'pref-theme-rain': 'Rain',
        'pref-lang': 'Language',
        'lang-en': 'ENGLISH',
        'lang-zh': '中文',
        'lang-ja': '日本語',
      },
      'zh': {
        'title': '魔方',
        'note': '双击开始',
        'timer': '0:00',
        'complete': '完成!',
        'best-time': '最佳时间!',
        'cube-size': '魔方阶数',
        'flip-type': '翻转动画',
        'scramble-length': '打乱步数',
        'camera-angle': '相机视角',
        'color-scheme': '配色方案',
        'hue': '色相',
        'saturation': '饱和度',
        'lightness': '亮度',
        'stats-cube': '阶数:',
        'stats-total-solves': '还原次数:',
        'stats-best-time': '最佳时间:',
        'stats-worst-time': '最差时间:',
        'stats-average-5': '5次平均:',
        'stats-average-12': '12次平均:',
        'stats-average-25': '25次平均:',
        'pref-flip-swift': '极速',
        'pref-flip-smooth': '流畅',
        'pref-flip-bounce': '回弹',
        'pref-view-ortho': '正交',
        'pref-view-persp': '透视',
        'pref-theme-cube': '经典',
        'pref-theme-erno': '厄尔诺',
        'pref-theme-dust': '尘埃',
        'pref-theme-camo': '迷彩',
        'pref-theme-rain': '雨天',
        'pref-lang': '语言设置',
        'lang-en': 'ENGLISH',
        'lang-zh': '中文',
        'lang-ja': '日本語',
      },
      'ja': {
        'title': 'キューブ',
        'note': 'ダブルタップで開始',
        'timer': '0:00',
        'complete': '完了!',
        'best-time': 'ベストタイム!',
        'cube-size': 'キューブサイズ',
        'flip-type': '回転アニメーション',
        'scramble-length': 'スクランブル長さ',
        'camera-angle': 'カメラ角度',
        'color-scheme': '配色',
        'hue': '色相',
        'saturation': '彩度',
        'lightness': '明度',
        'stats-cube': 'キューブ:',
        'stats-total-solves': '総解決数:',
        'stats-best-time': '最高記録:',
        'stats-worst-time': '最低記録:',
        'stats-average-5': '5回平均:',
        'stats-average-12': '12回平均:',
        'stats-average-25': '25回平均:',
        'pref-flip-swift': '高速',
        'pref-flip-smooth': 'スムーズ',
        'pref-flip-bounce': 'バウンス',
        'pref-view-ortho': '正交投影',
        'pref-view-persp': '透視投影',
        'pref-theme-cube': 'キューブ',
        'pref-theme-erno': 'エルノ',
        'pref-theme-dust': 'ダスト',
        'pref-theme-camo': 'カモ',
        'pref-theme-rain': 'レイン',
        'pref-lang': '言語設定',
        'lang-en': 'ENGLISH',
        'lang-zh': '中文',
        'lang-ja': '日本語',
      }
    };

    this.lang = 'en';

  }

  init() {
    // Call updateData to ensure proper initial display
    this.updateData();
  }

  setLang( lang ) {
    this.lang = lang;
    this.updateData();
  }

  getString( key ) {
    return this.dictionaries[ this.lang ][ key ] || key;
  }

  updateData() {

    const dict = this.dictionaries[ this.lang ];

    // Update simple text elements
    const elements = document.querySelectorAll( '[data-lang]' );
    elements.forEach( el => {
      const key = el.getAttribute( 'data-lang' );
      if ( dict[ key ] ) {
        if ( key === 'title' ) {
            // Skip title update when in Prefs, Theme, or Stats state to avoid flashing
            if ( this.game.state === 4 || this.game.state === 5 || this.game.state === 3 ) {
                return;
            }
            
            // Special handling for title: recreate spans
            const text = dict[key];
            const parts = text.split(' ');
            
            // Save current opacity to restore after updating
            const currentOpacity = el.style.opacity;
            
            el.innerHTML = '';
            if (parts.length > 1) {
                parts.forEach(part => {
                    const span = document.createElement('span');
                    span.innerText = part;
                    el.appendChild(span);
                });
            } else {
                 const span = document.createElement('span');
                 span.innerText = text;
                 el.appendChild(span);
            }
            
            // Restore opacity to prevent sudden appearance
            el.style.opacity = currentOpacity;

        } else if ( el.children.length > 0 && el.querySelector( 'i' ) ) {
          // preserve <i> and <b> tags for stats
          el.querySelector( 'i' ).innerText = dict[ key ];
        } else {
          el.innerText = dict[ key ];
        }
      }
    } );

    // For range inputs (Preferences)
    const ranges = this.game.preferences.ranges;
    if ( ranges ) {
      // Update titles
       const rangeKeys = {
         'size': 'cube-size',
         'flip': 'flip-type',
         'scramble': 'scramble-length',
         'fov': 'camera-angle',
         'theme': 'color-scheme',
         'hue': 'hue',
         'saturation': 'saturation',
         'lightness': 'lightness',
         'lang': 'pref-lang',
       }
       
       for ( const [rangeName, dictKey] of Object.entries(rangeKeys) ) {
          const rangeObj = ranges[ rangeName ];
          if ( rangeObj ) {
             let label = document.querySelector( `.range[name="${rangeName}"] .range__label` );
             if ( !label ) label = document.querySelector( `.picker[name="${rangeName}"] .picker__label` );

             if ( label ) label.innerText = dict[ dictKey ];

             if ( rangeName === 'lang' ) { // Update picker value text
                const pickerValue = document.querySelector( `.picker[name="${rangeName}"] .picker__value` );
                if ( pickerValue ) {
                    const valKey = 'lang-' + rangeObj.value;
                    if ( dict[ valKey ] ) pickerValue.innerText = dict[ valKey ];
                }
             }
          }
       }

       // Update range list items (options)
       this.updateRangeList('flip', ['pref-flip-swift', 'pref-flip-smooth', 'pref-flip-bounce']);
       this.updateRangeList('fov', ['pref-view-ortho', 'pref-view-persp']);
       this.updateRangeList('theme', ['pref-theme-cube', 'pref-theme-erno', 'pref-theme-dust', 'pref-theme-camo', 'pref-theme-rain']);
       this.updateRangeList('lang', ['lang-en', 'lang-zh', 'lang-ja']);

    }

  }
  
  updateRangeList( rangeName, keys ) {
    let listDivs = document.querySelectorAll( `.range[name="${rangeName}"] .range__list div` );
    if ( listDivs.length === 0 ) listDivs = document.querySelectorAll( `.picker[name="${rangeName}"] .picker__list div` );

    listDivs.forEach( ( div, index ) => {
      const key = keys[ index ];
      if ( key && this.dictionaries[ this.lang ][ key ] ) {
        div.innerText = this.dictionaries[ this.lang ][ key ];
      }
    });
    
    // Update picker value display after updating list
    if ( rangeName === 'lang' ) {
      const rangeObj = this.game.preferences.ranges[ rangeName ];
      if ( rangeObj ) {
        const pickerValue = document.querySelector( `.picker[name="${rangeName}"] .picker__value` );
        if ( pickerValue ) {
          const valKey = keys[ rangeObj.value ];
          if ( valKey && this.dictionaries[ this.lang ][ valKey ] ) {
            pickerValue.innerText = this.dictionaries[ this.lang ][ valKey ];
          }
        }
      }
    }
  }

  updateTitle() {
    const dict = this.dictionaries[ this.lang ];
    const title = document.querySelector( '[data-lang="title"]' );
    
    if ( !title || !dict['title'] ) return;
    
    const text = dict['title'];
    const parts = text.split(' ');
    const currentOpacity = title.style.opacity;
    
    title.innerHTML = '';
    if (parts.length > 1) {
        parts.forEach(part => {
            const span = document.createElement('span');
            span.innerText = part;
            title.appendChild(span);
        });
    } else {
         const span = document.createElement('span');
         span.innerText = text;
         title.appendChild(span);
    }
    
    title.style.opacity = currentOpacity;
  }

}
