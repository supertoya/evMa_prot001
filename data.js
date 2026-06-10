/* =====================================================================
   永遠闇市 プロトタイプ — 仮データ（data.js）
   ---------------------------------------------------------------------
   ここを編集すれば、ゲームの中身（ピンズ・客・各種数値）を差し替えられます。
   ※ 非エンジニアの方が触るのは主にこのファイルです。コード(index.html)は通常触りません。

   ・8軸の値の決まり（必ずこの範囲で書く）：
     size_mm     : 数字（mm）
     transparency: 'transparent'(透明) / 'translucent'(半透明) / 'opaque'(不透明)
     hasText     : true(文字記号あり) / false(なし)
     count       : 'single'(単体) / 'multiple'(複数)
     living      : true(生物) / false(無生物)
     motif       : 'animal'動物 / 'plant'植物 / 'person'人 / 'food'食 / 'object'器物
                   / 'nature'自然 / 'heraldry'紋章 / 'vehicle'乗物 / 'building'建物
     shape       : 'circle'円形 / 'angular'角形 / 'irregular'不定形
     symmetry    : true(左右対称) / false(非対称)
   ===================================================================== */

window.EM_DATA = (function () {

  // ---- 調整つまみ（数値はここで変える）----------------------------------
  const CONFIG = {
    turns: 5,                       // 全ターン数
    fieldCustomers: 4,              // 場に並ぶ客の数（2人戦＝各自2枚×2）
    pinsPerPlayer: 20,              // 各自のピンズ総数
    pinsPerTurn: 4,                 // 毎ターン刺すピンズ数
    customersPresentedPerPlayer: 2, // 毎ターン各自が場に出す客
    relicsDrawnPerTurn: 2,          // 毎ターン引く遺物（Phase2で使用）
    startingCoins: 0,               // 種銭（0スタート。Phase2でコイン消費を入れる際に再検討：0=稼いでから使う／3〜5=初手から動ける）
    vpByRarity: { C: 1, UC: 2, R: 4 }, // レア度ごとの勝利点＝獲得コイン
    tiebreak: 'none',               // 同点客：'none'流れる / 'both'両取り / 'split'半分
    unplacedPin: 'carry',           // 余ったピンの扱い（Phase1では未使用）
    randomSeed: true,               // true=毎回ランダム（チーム試遊向き）／false=rngSeedで固定（再現・デバッグ用）
    rngSeed: 20260609,              // randomSeed:false のときに使う固定シード
  };

  // ---- ピンズ・プール（24種）-------------------------------------------
  const PIN_POOL = [
    { id:'pin_tsuki',    name:'月のかけら',     size_mm:16, transparency:'translucent', hasText:false, count:'single',   living:false, motif:'nature',   shape:'circle',    symmetry:true  },
    { id:'pin_kuroneko', name:'黒猫の根付',     size_mm:24, transparency:'opaque',      hasText:false, count:'single',   living:true,  motif:'animal',   shape:'irregular', symmetry:false },
    { id:'pin_bara',     name:'硝子の薔薇',     size_mm:20, transparency:'transparent', hasText:false, count:'single',   living:true,  motif:'plant',    shape:'irregular', symmetry:false },
    { id:'pin_kagi',     name:'錆びた鍵',       size_mm:30, transparency:'opaque',      hasText:false, count:'single',   living:false, motif:'object',   shape:'angular',   symmetry:false },
    { id:'pin_kinka',    name:'古い金貨',       size_mm:18, transparency:'opaque',      hasText:true,  count:'single',   living:false, motif:'object',   shape:'circle',    symmetry:true  },
    { id:'pin_hato',     name:'白鳩の紋',       size_mm:22, transparency:'opaque',      hasText:false, count:'single',   living:true,  motif:'animal',   shape:'circle',    symmetry:true  },
    { id:'pin_honoo',    name:'蝋燭の焔',       size_mm:14, transparency:'translucent', hasText:false, count:'single',   living:false, motif:'nature',   shape:'irregular', symmetry:false },
    { id:'pin_pan',      name:'焼きたてのパン', size_mm:28, transparency:'opaque',      hasText:false, count:'single',   living:false, motif:'food',     shape:'irregular', symmetry:false },
    { id:'pin_budou',    name:'紫の葡萄',       size_mm:26, transparency:'translucent', hasText:false, count:'multiple', living:true,  motif:'plant',    shape:'circle',    symmetry:false },
    { id:'pin_hoshi',    name:'銀の星章',       size_mm:20, transparency:'opaque',      hasText:false, count:'multiple', living:false, motif:'heraldry', shape:'angular',   symmetry:true  },
    { id:'pin_fune',     name:'帆船の模型',     size_mm:40, transparency:'opaque',      hasText:false, count:'single',   living:false, motif:'vehicle',  shape:'irregular', symmetry:false },
    { id:'pin_tou',      name:'時計塔の写し',   size_mm:48, transparency:'opaque',      hasText:true,  count:'single',   living:false, motif:'building', shape:'angular',   symmetry:true  },
    { id:'pin_sakana',   name:'群れる小魚',     size_mm:32, transparency:'translucent', hasText:false, count:'multiple', living:true,  motif:'animal',   shape:'irregular', symmetry:false },
    { id:'pin_ha',       name:'楓の葉',         size_mm:34, transparency:'translucent', hasText:false, count:'single',   living:true,  motif:'plant',    shape:'irregular', symmetry:true  },
    { id:'pin_men',      name:'笑いの仮面',     size_mm:36, transparency:'opaque',      hasText:false, count:'single',   living:false, motif:'person',   shape:'irregular', symmetry:true  },
    { id:'pin_ringo',    name:'蜜の林檎',       size_mm:24, transparency:'opaque',      hasText:false, count:'single',   living:false, motif:'food',     shape:'circle',    symmetry:true  },
    { id:'pin_inazuma',  name:'稲妻の欠片',     size_mm:30, transparency:'transparent', hasText:false, count:'single',   living:false, motif:'nature',   shape:'angular',   symmetry:false },
    { id:'pin_ryu',      name:'双頭の竜章',     size_mm:38, transparency:'opaque',      hasText:false, count:'multiple', living:true,  motif:'heraldry', shape:'angular',   symmetry:true  },
    { id:'pin_haguruma', name:'歯車の輪',       size_mm:26, transparency:'opaque',      hasText:false, count:'multiple', living:false, motif:'object',   shape:'circle',    symmetry:true  },
    { id:'pin_watari',   name:'渡り鳥の列',     size_mm:42, transparency:'opaque',      hasText:false, count:'multiple', living:true,  motif:'animal',   shape:'irregular', symmetry:false },
    { id:'pin_suisho',   name:'透き通る水晶',   size_mm:12, transparency:'transparent', hasText:false, count:'single',   living:false, motif:'nature',   shape:'angular',   symmetry:true  },
    { id:'pin_fuda',     name:'符の護符',       size_mm:50, transparency:'opaque',      hasText:true,  count:'single',   living:false, motif:'object',   shape:'angular',   symmetry:true  },
    { id:'pin_hana3',    name:'三輪の花',       size_mm:28, transparency:'translucent', hasText:false, count:'multiple', living:true,  motif:'plant',    shape:'circle',    symmetry:false },
    { id:'pin_kabe',     name:'石壁の紋様',     size_mm:46, transparency:'opaque',      hasText:true,  count:'multiple', living:false, motif:'building', shape:'angular',   symmetry:false },
  ];

  // ---- 客プール（16種：C8 / UC5 / R3）----------------------------------
  // conditions の個数＝ C:3 / UC:4 / R:5（レア度＝条件数）
  const CUSTOMER_POOL = [
    // --- C コモン（条件3・vp1）---
    { id:'c_mayoineko', name:'迷い猫を探す娘',   rarity:'C', vp:1, flavor:'「うちの子、見ませんでしたか」',
      conditions:[ {axis:'living',op:'==',value:true}, {axis:'motif',op:'==',value:'animal'}, {axis:'count',op:'==',value:'single'} ] },
    { id:'c_akari',     name:'灯りを乞う子供',   rarity:'C', vp:1, flavor:'「くらいよ、ひかりがほしい」',
      conditions:[ {axis:'transparency',op:'!=',value:'opaque'}, {axis:'motif',op:'==',value:'nature'}, {axis:'hasText',op:'==',value:false} ] },
    { id:'c_kanmi',     name:'甘味に飢えた老人', rarity:'C', vp:1, flavor:'「甘いものを、ひとつ」',
      conditions:[ {axis:'motif',op:'==',value:'food'}, {axis:'hasText',op:'==',value:false}, {axis:'size_mm',op:'<=',value:28} ] },
    { id:'c_insho',     name:'印章を集める書記', rarity:'C', vp:1, flavor:'「記された文字こそ価値だ」',
      conditions:[ {axis:'hasText',op:'==',value:true}, {axis:'motif',op:'==',value:'object'}, {axis:'shape',op:'==',value:'angular'} ] },
    { id:'c_chiisaki',  name:'小さき物を愛でる姫',rarity:'C', vp:1, flavor:'「手のひらに収まるものが好き」',
      conditions:[ {axis:'size_mm',op:'<=',value:18}, {axis:'symmetry',op:'==',value:true}, {axis:'living',op:'==',value:false} ] },
    { id:'c_mure',      name:'群れを好む漁師',   rarity:'C', vp:1, flavor:'「数こそ豊かさよ」',
      conditions:[ {axis:'count',op:'==',value:'multiple'}, {axis:'living',op:'==',value:true}, {axis:'motif',op:'==',value:'animal'} ] },
    { id:'c_hana',      name:'花を待つ娘',       rarity:'C', vp:1, flavor:'「一輪の花を、あの人へ」',
      conditions:[ {axis:'motif',op:'==',value:'plant'}, {axis:'count',op:'==',value:'single'}, {axis:'living',op:'==',value:true} ] },
    { id:'c_maruki',    name:'円きものの収集家', rarity:'C', vp:1, flavor:'「角のないものに惹かれる」',
      conditions:[ {axis:'shape',op:'==',value:'circle'}, {axis:'symmetry',op:'==',value:true}, {axis:'living',op:'==',value:false} ] },

    // --- UC アンコモン（条件4・vp2）---
    { id:'u_uranai',    name:'透徹を求める占い師', rarity:'UC', vp:2, flavor:'「濁りのない器に未来が映る」',
      conditions:[ {axis:'transparency',op:'==',value:'transparent'}, {axis:'living',op:'==',value:false}, {axis:'shape',op:'==',value:'angular'}, {axis:'motif',op:'==',value:'nature'} ] },
    { id:'u_tabi',      name:'旅を夢見る少年',     rarity:'UC', vp:2, flavor:'「遠くへ、どこまでも」',
      conditions:[ {axis:'motif',op:'==',value:'vehicle'}, {axis:'size_mm',op:'>=',value:38}, {axis:'living',op:'==',value:false}, {axis:'hasText',op:'==',value:false} ] },
    { id:'u_kishi',     name:'紋章を掲げる騎士',   rarity:'UC', vp:2, flavor:'「我が家名にかけて」',
      conditions:[ {axis:'motif',op:'==',value:'heraldry'}, {axis:'symmetry',op:'==',value:true}, {axis:'count',op:'==',value:'multiple'}, {axis:'living',op:'==',value:false} ] },
    { id:'u_houjou',    name:'豊穣を祝う料理人',   rarity:'UC', vp:2, flavor:'「実り多き食卓を」',
      conditions:[ {axis:'motif',op:'==',value:'food'}, {axis:'size_mm',op:'>=',value:24}, {axis:'hasText',op:'==',value:false}, {axis:'symmetry',op:'==',value:true} ] },
    { id:'u_suuhai',    name:'大いなるものの崇拝者',rarity:'UC', vp:2, flavor:'「巨大なる威容にひれ伏す」',
      conditions:[ {axis:'size_mm',op:'>=',value:40}, {axis:'motif',op:'==',value:'building'}, {axis:'hasText',op:'==',value:true}, {axis:'shape',op:'==',value:'angular'} ] },

    // --- R レア（条件5・vp4）＝ 神の依代 ---
    { id:'r_noshinogan', name:'知識の依代 ノシノ＝ガン', rarity:'R', vp:4, flavor:'無数の瞼を持つ書物の神。',
      conditions:[ {axis:'hasText',op:'==',value:true}, {axis:'motif',op:'==',value:'object'}, {axis:'shape',op:'==',value:'angular'}, {axis:'symmetry',op:'==',value:true}, {axis:'size_mm',op:'>=',value:50} ] },
    { id:'r_kyamekura',  name:'自由の依代 キャメクラ',   rarity:'R', vp:4, flavor:'千の鎖に巻かれた天使。',
      conditions:[ {axis:'living',op:'==',value:true}, {axis:'count',op:'==',value:'multiple'}, {axis:'motif',op:'==',value:'animal'}, {axis:'size_mm',op:'>=',value:40}, {axis:'shape',op:'==',value:'irregular'} ] },
    { id:'r_anajaru',    name:'不朽の依代 アナジャル',   rarity:'R', vp:4, flavor:'剣に貫かれた透明の胸像。',
      conditions:[ {axis:'transparency',op:'==',value:'transparent'}, {axis:'symmetry',op:'==',value:true}, {axis:'living',op:'==',value:false}, {axis:'size_mm',op:'<=',value:20}, {axis:'motif',op:'==',value:'nature'} ] },
  ];

  // ---- 遺物・主人公（Phase2/3 で実装。構造だけ用意）---------------------
  const RELIC_POOL = [];
  const HERO_POOL = [];

  // ---- 見本デッキの自動構築（プールから決め打ちで選ぶ）------------------
  // プールを編集すれば、デッキも自動で追従します。
  function rot(arr, n){ const L=arr.length; n=((n%L)+L)%L; return arr.slice(n).concat(arr.slice(0,n)); }
  function buildBucket(ids, need, limit, offset){
    const pool = rot(ids, offset), counts={}, out=[];
    let i=0, guard=0;
    while(out.length<need && guard<need*50){
      const id = pool[i % pool.length];
      if((counts[id]||0) < limit){ out.push(id); counts[id]=(counts[id]||0)+1; }
      i++; guard++;
    }
    return out;
  }
  const C_IDS  = CUSTOMER_POOL.filter(c=>c.rarity==='C').map(c=>c.id);
  const UC_IDS = CUSTOMER_POOL.filter(c=>c.rarity==='UC').map(c=>c.id);
  const R_IDS  = CUSTOMER_POOL.filter(c=>c.rarity==='R').map(c=>c.id);
  const PIN_IDS = PIN_POOL.map(p=>p.id);

  function buildCustomerDeck(offset){
    return [].concat(
      buildBucket(C_IDS, 12, 3, offset),
      buildBucket(UC_IDS, 6, 2, offset),
      buildBucket(R_IDS, 2, 1, offset)
    );
  }
  function buildPinDeck(offset){ return rot(PIN_IDS, offset).slice(0, CONFIG.pinsPerPlayer); }

  const PRESET_DECKS = {
    p0: { pins: buildPinDeck(0), customers: buildCustomerDeck(0) },
    p1: { pins: buildPinDeck(7), customers: buildCustomerDeck(2) },
  };

  return { CONFIG, PIN_POOL, CUSTOMER_POOL, RELIC_POOL, HERO_POOL, PRESET_DECKS };
})();
