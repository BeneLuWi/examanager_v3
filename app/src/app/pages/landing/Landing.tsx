import React, { FunctionComponent } from "react"
import { Card, Col, Row } from "react-bootstrap"

type LandingProps = {}

const Landing: FunctionComponent<LandingProps> = ({}) => {
  /*******************************************************************************************************************
   *
   *  Hooks
   *
   *******************************************************************************************************************/

  /*******************************************************************************************************************
   *
   *  Functions
   *
   *******************************************************************************************************************/

  /*******************************************************************************************************************
   *
   *  Rendering
   *
   *******************************************************************************************************************/

  return (
    <div>
      <div className="page-header">Willkommen im Examanager</div>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>
                <i className="bi bi-info-circle" /> Aufbau der Anwendung
              </Card.Title>
              Mit Hilfe des Examanagers können Statistiken zu Klausurergebnissen Ihrer Klassen erhoben und dargestellt
              werden. Es gibt 3 Registerkarten, unter denen bestimmte Funktionalitäten gefunden werden:
              <Row className="mt-2">
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        <i className="bi bi-people" /> Klassen
                      </Card.Title>
                      <ul>
                        <li>Erstellen und Verwalten der Schulklassen</li>
                        <li>Eintragen von Klausurergebnissen</li>
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        <i className="bi bi-list-check" /> Klausuren
                      </Card.Title>
                      <ul>
                        <li>Erstellen und Bearbeiten von Klausuren</li>
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        <i className="bi bi-bar-chart" /> Statisiken
                      </Card.Title>
                      <ul>
                        <li>Anzeige und Download von deskriptiven Statistiken für Klausurergebnissen</li>
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>
                <i className="bi bi-question-circle" /> Fragen
              </Card.Title>
              <ul>
                <li>Bei inhaltlichen Fragen wenden Sie sich bitte an Ihren Dozenten</li>
                <li>
                  Technische Probleme können direkt an{" "}
                  <a href="mailto:b.lueken.winkels@gmail.com">Benedikt Lüken-Winkels</a> gehen
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>
                <i className="bi bi-code-square" /> Projekt
              </Card.Title>
              <p>
                Der Examanager ist ein (Feizeit) Open-Source Projekt. Der Programmcode ist offen auf{" "}
                <a href="https://github.com/BeneLuWi/examanager_v3" target="_blank">
                  Github
                </a>{" "}
                zu finden.
              </p>
              <div>Entwickler</div>
              <ul>
                <li>
                  David Kaub{" "}
                  <a href="https://www.linkedin.com/in/david-kaub-364537211/" target="_blank">
                    <i className="bi bi-linkedin" />
                  </a>
                </li>
                <li>
                  Benedikt Lüken-Winkels{" "}
                  <a href="https://www.beluwi.de" target="_blank">
                    <i className="bi bi-browser-chrome" />
                  </a>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Landing
