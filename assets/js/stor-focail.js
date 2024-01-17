const POST_URL = "http://localhost:8080"
// const RÁTA = 0.002934; // ráta na heaspónantúile dáilte
const RÁTA = 0.00012; // ráta pioctha chun shampla níos fearr a fháil
const MÉID_NA_BHFOCAL_LE_ÚSÁID = 20; // 20, 50, 100, srl.
let focail_an_chluiche = [];
let uimhir_focail_thuigthe = 0;
let uimhir_focail_fheicthe = 0;
let tuigthe = [];


/**
 * Lodáil na focail agus na minicíochtaí ón chomhad agus cuir tús leis an staid.
 */
fetch("assets/minicíochtaí_gaeilge.txt")
  .then((res) => res.text())
  .then((text) => {
    leirighStaidThosaigh(text.split('\n'));
  })
  .catch((e) => console.error(e));

/**
 * Faigh liosta na bhfocal a úsaid sa bhabhta seo agus uasdátaigh an scáileán.
 * 
 * @param {string[]} focailThosaigh - liosta na bhfocal agus na minicíochtaí go leor
 */
function leirighStaidThosaigh(focailThosaigh) {
  focail_an_chluiche = faighSampla(focailThosaigh).map((x) => x.split(" ")[0]);
  console.log('focail an chluiche seo: ', focail_an_chluiche);

  uimhir_focail_thuigthe = 0;
  uasdátaighScáileán();
}

/**
 * Uasdátaigh na athróga ar an scáileán, an cheist fhocal agus na méid uimhir
 * fheicthe go dtí seo.
 */
function uasdátaighScáileán() {
  document.getElementById('ceist-fhocal').innerText = focail_an_chluiche[uimhir_focail_fheicthe];
  document.getElementById('focail-fheicte').innerText = `${uimhir_focail_fheicthe + 1}/${MÉID_NA_BHFOCAL_LE_ÚSÁID}`;
}

/**
 * Faigh uimhir go randamach.
 * 
 * @param {number} uasuimhir - an uimhir is mó is féidir leat a fháil
 * @return {number} uimhir randamach
 */
function faighUimhirRandamach(uasuimhir) {
  return Math.floor(Math.random() * uasuimhir);
}

/**
 * As an liosta, tóg sampla d'fhocail. Faigh sampla easpónantúil, mar sin,
 * is féidir linn níos mó focail ó thús an liosta agus níos lú ón deireadh.
 * 
 * @param {string[]} focail - liosta na bhfocal go bhfaighimid na focail as
 * @return {string[]} sampla ón liosta na bhfocal
 */
function faighSampla(focail) {
  let focail_ón_sampla = [];
  for (let i = 0; i < MÉID_NA_BHFOCAL_LE_ÚSÁID; i++) {
    // - ln(u_i) / lambda
    const innéacs = Math.floor((-Math.log(Math.random())/RÁTA));
    if (focail[innéacs] != undefined) {
      focail_ón_sampla.push(focail[innéacs]);
    }
  }

  // Braitheann an sampla ar randamacht, mar sin, tá seans beag ann go mbeadh
  // an t-innéacs níos airde ná fad an liosta. Sa chás seo pioc cúpla focal
  // eile chun an tsampla a líonadh amach.
  const bearna = MÉID_NA_BHFOCAL_LE_ÚSÁID - focail_ón_sampla.length;
  if (bearna > 0) {
    for (let j = 0; j < bearna; j++) {
      focail_ón_sampla.push(focail[faighUimhirRandamach(focail.length - 1)]);
    }
  }

  // Socraigh na línte maidir leis an minicíocht
  focail_ón_sampla.sort((a, b) => (+b.split(' ')[1]) - (+a.split(' ')[1]));
  return focail_ón_sampla;
}

/**
 * Nuair atá brú ar an gcnaipe, cuir síos go raibh an focail tuigthe agus
 * faigh an chéad focal eile.
 */
async function tuigim() {
  tuigthe.push(1);
  uimhir_focail_thuigthe += 1;

  ceistFhocalEile();
}

/**
 * Nuair atá brú ar an gcnaipe, cuir síos nach raibh an focal tuigthe agus
 * faigh an chéad focal eile.
 */
function niThuigim() {
  tuigthe.push(0);
  ceistFhocalEile();
}

/**
 * Má bhíonn na focail uilig fheicthe, faigh an ríomh agus cuir críoch leis
 * an mbabhta nó uasdátaigh an scáileán.
 */
async function ceistFhocalEile() {
  uimhir_focail_fheicthe += 1;
  if (uimhir_focail_fheicthe > MÉID_NA_BHFOCAL_LE_ÚSÁID - 1) {
    // Críoch
    console.log('tuigthe: ', tuigthe);
    const toradh = await faighRíomh(tuigthe, focail_an_chluiche);
    console.log(`toradh: ${toradh}`);
    // TODO: Léirigh clogchuar
    document.getElementById('ceist-fhocal').innerText = `CRÍOCH. Do thoradh: ${toradh}`;
  } else {
    uasdátaighScáileán();
  }
}

/**
 * Seol iarratas chuig an bhfreastalaí chun ríomh an stóir fhocail a fháil.
 * 
 * @param {number[]} known - cé acu a bhí tuighte. 1 nuair atá an focal
 *                           tuighte agus 0 taobh amuigh de sin.
 * @param {string[]} words - liosta na bhfocal ón babhta
 * @return {JSON} - an freagra ón freastalaí
 */
async function faighRíomh(known, words) {
  const res = await fetch(POST_URL + `?known=${JSON.stringify(known)}&words=${JSON.stringify(words)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=UTF-8"
    }
  });
  return res.json();
}
