const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const api_key = process.env.NLU_KEY;
const url = process.env.NLU_URL;

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
    version: '2020-08-01',
    authenticator: new IamAuthenticator({
        apikey: api_key,
    }),
    serviceUrl: url
  });

exports.handler = async (event) => {
    
    const analyzeParams = {
        'text': event.historial_clinico,
        'features': {
          'entities': {
            'sentiment': true,
            'emotion': true,
            'limit': 5,
          },
          'keywords': {
            'sentiment': true,
            'emotion': true,
            'limit': 5,
          },
        },
      };
    
    let response = {}
    
    let analysisResults = await naturalLanguageUnderstanding.analyze(analyzeParams)

    let key_words = []
    let entities = []
    let palabras_clave_desc = {}
    let entidades_desc = {}

    analysisResults.result.keywords.forEach(value => {
        key_words.push(value.text)
        palabras_clave_desc[value.text] = {
            "sentimiento": value.sentiment.label,
            "relevancia": value.relevance,
            "repeticiones": value.count,
            "emocion": value.emotion
        }
    })
    analysisResults.result.entities.forEach(value => {
        entities.push(value.text)
        entidades_desc[value.text] = {
            "tipo": value.type,
            "sentimiento": value.sentiment.label,
            "relevancia": value.relevance,
            "emocion": value.emotion,
            "repeticiones": value.count,
            "porcentaje_confianza": value.confidence
        }
    })

    response = {
        "lenguaje_texto": analysisResults.result.language,
        "palabras_clave": key_words,
        "entidades": entities,
        "palabras_clave_desc": palabras_clave_desc,
        "entidades_desc": entidades_desc
    }
    
    //response = analysisResults
    return response
};
