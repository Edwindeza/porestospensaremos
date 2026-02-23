import { useState, useCallback, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { useDataStore } from '../store/useDataStore'
import { ENCUESTA, applyEncuestaToStore } from '../data/encuestaConfig'
import { TITLES, getModalTexto } from '../data/indicadorInfo'

export default function Encuesta() {
  const navigate = useNavigate()
  const loadData = useDataStore((s) => s.loadData)
  const setEncuestaRespuestas = useDataStore((s) => s.setEncuestaRespuestas)
  const indicadores = useDataStore((s) => s.indicadores)
  const descartadosTotal = useDataStore((s) => s.descartadosTotal)
  const totalPartidos = indicadores?.partidos?.length ?? 0
  const tachados = descartadosTotal?.size ?? 0
  const restantes = totalPartidos - tachados
  const infoIndicadorId = useDataStore((s) => s.infoIndicadorId)
  const setInfoIndicadorId = useDataStore((s) => s.setInfoIndicadorId)
  const setModo = useDataStore((s) => s.setModo)

  useEffect(() => { setModo('encuesta') }, [setModo])

  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState('next')
  const [answers, setAnswers] = useState(() => {
    const init = {}
    ENCUESTA.forEach((b) => {
      if (b.type === 'checkbox') init[b.id] = []
      else init[b.id] = ''
    })
    return init
  })

  const goNext = useCallback(() => {
    loadData().then(() => {
      const { indicadores, setUmbralesFromEncuesta: setUmbrales } = useDataStore.getState()
      applyEncuestaToStore(answers, indicadores?.meta, setUmbrales)
      setDirection('next')
      setStep((s) => s + 1)
    })
  }, [answers, loadData])

  const setAnswer = useCallback((id, value) => {
    const nextAnswers = { ...answers, [id]: value }
    setAnswers(nextAnswers)
    loadData().then(() => {
      const { indicadores, setUmbralesFromEncuesta: setUmbrales } = useDataStore.getState()
      applyEncuestaToStore(nextAnswers, indicadores?.meta, setUmbrales)
      if (step === ENCUESTA.length - 1) {
        setEncuestaRespuestas(nextAnswers)
        navigate('/ranking')
      } else {
        setDirection('next')
        setStep((s) => s + 1)
      }
    })
  }, [answers, step, loadData, setEncuestaRespuestas, navigate])

  /** Avanzar al siguiente ítem al hacer clic de nuevo en la opción ya seleccionada (onChange no se dispara en radios). */
  const advanceToNext = useCallback(() => {
    loadData().then(() => {
      const { indicadores, setUmbralesFromEncuesta: setUmbrales } = useDataStore.getState()
      applyEncuestaToStore(answers, indicadores?.meta, setUmbrales)
      if (step === ENCUESTA.length - 1) {
        setEncuestaRespuestas(answers)
        navigate('/ranking')
      } else {
        setDirection('next')
        setStep((s) => s + 1)
      }
    })
  }, [answers, step, loadData, setEncuestaRespuestas, navigate])

  const toggleCheckbox = useCallback((id, value) => {
    setAnswers((prev) => {
      const arr = prev[id] || []
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
      return { ...prev, [id]: next }
    })
  }, [])

  const block = ENCUESTA[step]
  const isCheckboxBlock = block?.type === 'checkbox'
  const checkboxSelection = block && (answers[block.id] || [])
  const canAdvanceCheckbox = Array.isArray(checkboxSelection) && checkboxSelection.length > 0

  return (
    <>
      <Helmet>
        <title>Encuesta — #PorEstosSi</title>
        <meta name="description" content="Responde unas preguntas y descubre qué partidos se acercan a lo que tú esperas para el Senado Nacional 2026." />
      </Helmet>
      <div className="page page-encuesta">
        <h1>#PorEstosSi</h1>
        <p className="encuesta-intro">
          Responde según lo que tú aceptarías en los candidatos al Senado Nacional.
        </p>

        <div className="encuesta-progress-wrap">
          <div className="encuesta-progress" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={ENCUESTA.length} aria-label="Progreso de la encuesta">
            <div className="encuesta-progress-bar" style={{ width: `${(step + 1) / ENCUESTA.length * 100}%` }} />
          </div>
          <div className="encuesta-progress-text">
            <span className="encuesta-progress-counts">
              {totalPartidos > 0 ? (
                <>
                  <span className="encuesta-progress-count encuesta-progress-count--restantes">{restantes} restantes</span>
                  <span className="encuesta-progress-sep" aria-hidden="true"> / </span>
                  <span className="encuesta-progress-count encuesta-progress-count--tachados">{tachados} tachados</span>
                </>
              ) : (
                <span aria-hidden="true"> </span>
              )}
            </span>
            <span className="encuesta-progress-step">{step + 1} de {ENCUESTA.length}</span>
          </div>
        </div>

        <form className="encuesta-form" onSubmit={(e) => e.preventDefault()}>
          <div className={`encuesta-step-wrap encuesta-step-wrap--${direction}`} key={step}>
            {block && (
              <fieldset className="encuesta-block encuesta-step-block">
                <legend className="encuesta-block-title">{block.title}</legend>
                <div className="encuesta-question-wrap">
                  <p className="encuesta-question">
                    {typeof block.question === 'string'
                      ? block.question.split(/(\*[^*]+\*)/g).map((p, i) =>
                          p.startsWith('*') && p.endsWith('*') ? <strong key={i}>{p.slice(1, -1)}</strong> : p
                        )
                      : block.question}
                  </p>
                  <button
                    type="button"
                    className="indicador-info-btn indicador-info-btn-encuesta"
                    onClick={() => setInfoIndicadorId(block.id)}
                    aria-label={`Información: ${block.title}`}
                    title={`Información: ${block.title}`}
                  >
                    i
                  </button>
                </div>
                <div className="encuesta-options" role={block.type === 'radio' ? 'radiogroup' : undefined} aria-label={typeof block.question === 'string' ? block.question.replace(/\*[^*]+\*/g, (m) => m.slice(1, -1)) : block.question}>
                  {block.type === 'radio' &&
                    block.options.map((opt) => (
                      <label
                        key={opt.value}
                        className="encuesta-option"
                        onClick={(e) => {
                          if (answers[block.id] === opt.value) {
                            e.preventDefault()
                            advanceToNext()
                          }
                        }}
                      >
                        <input
                          type="radio"
                          name={`encuesta-${block.id}`}
                          value={opt.value}
                          checked={answers[block.id] === opt.value}
                          onChange={() => setAnswer(block.id, opt.value)}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  {block.type === 'checkbox' &&
                    block.options.map((opt) => (
                      <label key={opt.value} className="encuesta-option">
                        <input
                          type="checkbox"
                          value={opt.value}
                          checked={(answers[block.id] || []).includes(opt.value)}
                          onChange={() => toggleCheckbox(block.id, opt.value)}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                </div>
                {isCheckboxBlock && (
                  <button type="button" className="btn encuesta-next-btn" onClick={goNext} disabled={!canAdvanceCheckbox}>
                    Siguiente
                  </button>
                )}
              </fieldset>
            )}
          </div>

          {step > 0 && (
            <button
              type="button"
              className="btn btn-outline encuesta-back"
              onClick={() => { setDirection('prev'); setStep(step - 1) }}
            >
              ← Anterior
            </button>
          )}
        </form>
      </div>

      {infoIndicadorId && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-titulo-encuesta">
          <div className="modal-backdrop" onClick={() => setInfoIndicadorId(null)} aria-hidden="true" />
          <div className="modal-caja">
            <div className="modal-cabecera">
              <h2 id="modal-titulo-encuesta" className="modal-titulo">{TITLES[infoIndicadorId] || `Indicador ${infoIndicadorId}`}</h2>
              <button
                type="button"
                className="modal-cerrar"
                onClick={() => setInfoIndicadorId(null)}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            <div className="modal-texto">
              {getModalTexto(infoIndicadorId)
                .split(/\n\n+/)
                .filter((p) => p.trim())
                .map((textBlock, i) => {
                  const boldPhrase = 'sin considerar los que declararon S/ 0 ni valores máximos extremos'
                  const parts = textBlock.split(boldPhrase)
                  const content = parts.length === 2
                    ? <>{parts[0]}<strong>{boldPhrase}</strong>{parts[1]}</>
                    : textBlock
                  return (
                    <p key={i} className={textBlock.startsWith('PR —') || textBlock.startsWith('SE —') || textBlock.startsWith('ETC —') || textBlock.startsWith('ENU —') || textBlock.startsWith('EU —') || textBlock.startsWith('EPM —') || textBlock.startsWith('EPD —') ? 'modal-texto-item' : ''}>
                      {content}
                    </p>
                  )
                })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
