/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/**
 * This is an example component for an xblock Editor
 * It uses pre-existing components to handle the saving of a the result of a function into the xblock's data.
 * To use run npm run-script addXblock <your>
 */

/* eslint-disable no-unused-vars */

//Required Imports
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import * as module from '.';
import { actions, selectors } from '../../data/redux';
import { RequestKeys } from '../../data/constants/requests';
import './index.scss';

//Games Editor Imports
import { Form, Spinner, Collapsible, Icon, IconButton, Dropdown } from '@edx/paragon';
import EditorContainer from '../EditorContainer';
import { DeleteOutline, Add, ExpandMore, ExpandLess, InsertPhoto, MoreHoriz, Check } from '@edx/paragon/icons';
import SettingsOption from '../ProblemEditor/components/EditProblemView/SettingsWidget/SettingsOption';
import Button from '../../sharedComponents/Button';
import DraggableList from '../../sharedComponents/DraggableList';
import { SortableItem } from '../../sharedComponents/DraggableList';

//Obsolete Imports
import RawEditor from '../../sharedComponents/RawEditor';
import CardSection from '../ProblemEditor/components/EditProblemView/SettingsWidget/CardSection';
import SettingsWidget from '../ProblemEditor/components/EditProblemView/SettingsWidget';
import SelectionModal from '../../sharedComponents/SelectionModal';
import ExpandableTextArea from '../../sharedComponents/ExpandableTextArea';

export const hooks = {
  getContent: () => ({
    some: 'content',
  }),
};

export const GameEditor = ({
  onClose,
  // redux
  blockValue,
  lmsEndpointUrl,
  blockFailed,
  blockFinished,
  initializeEditor,

  //settings
  settings,
  shuffleTrue,
  shuffleFalse,
  timerTrue,
  timerFalse,
    //type (eventually in settings)
  type,
  updateType,

  //list
  list,
  updateTerm,
  updateTermImage,
  updateDefinition,
  updateDefinitionImage,
  toggleOpen,
  setList,
  addCard,
  removeCard,

  //inject
  intl,
}) => {
  //Console logs go here
  console.log(list);

  //State for list
  const [state, setState] = React.useState(list);
  React.useEffect(() => { setState(list); }, [list]);

  //Non-reducer functions go here
  const getDescriptionHeader = () => {
    //Function to determine what the header will say based on type
    switch(type) {
      case 'flashcards':
        return 'Flashcard terms';
      case 'matching':
        return 'Matching terms';
      default:
        return 'Undefined';
    }
  }

  const getDescription = () => {
    //Function to determine what the description will say based on type
    switch(type) {
      case 'flashcards':
        return 'Enter your terms and definitions below. Learners will review each card by viewing the term, then flipping to reveal the definition.';
      case 'matching':
        return 'Enter your terms and definitions below. Learners must match each term with the correct definition.';
      default:
        return 'Undefined';
    }
  }

  const saveTermImage = (index) => {
    let file = document.getElementById('term_image_upload'+index).files[0];
    if(file) {
      let reader = new FileReader();

      reader.onload = (event) => {
        updateTermImage({index, term_image: event.target.result});
      }
      reader.readAsDataURL(file);
    }
  }

  const removeTermImage = (index) => {
    document.getElementById('term_image_upload'+index).value = '';
    updateTermImage({index, term_image: ''});
  }

  const saveDefinitionImage = (index) => {
    let file = document.getElementById('definition_image_upload'+index).files[0];
    if(file) {
      let reader = new FileReader();

      reader.onload = (event) => {
        updateDefinitionImage({index, definition_image: event.target.result});
      }
      reader.readAsDataURL(file);
    }
  }

  const removeDefintionImage = (index) => {
    document.getElementById('definition_image_upload'+index).value = '';
    updateDefinitionImage({index, definition_image: ''});
  }

  const moveCardUp = (index) => {
    if (index == 0)
      return;
    let temp = state.slice();
    [temp[index], temp[index-1]] = [temp[index-1], temp[index]]
    setState(temp)
  }

  const moveCardDown = (index) => {    
    if (index == state.length-1)
      return;
    let temp = state.slice();
    [temp[index+1], temp[index]] = [temp[index], temp[index+1]]
    setState(temp)
  }

  //Page content goes here
  return (
  <EditorContainer
    getContent={module.hooks.getContent}
    onClose={onClose}
  >
    <div className="editor-body h-75 overflow-auto">
      {!blockFinished
        ? (
          <div className="text-center p-6">
            <Spinner
              animation="border"
              className="m-3"
              // Use a messages.js file for intl messages.
              screenreadertext={intl.formatMessage('Loading Spinner')}
            />
          </div>
        )
        : (/*
          <p>
            Your Editor Goes here.
            You can get at the xblock data with the blockValue field.
            here is what is in your xblock:  {JSON.stringify(blockValue)}
          </p>*/<span></span>
        )}
    </div>

    {
    //Page body starts here
    }
    <div class="page-body d-flex align-items-start">
      <div class="terms d-flex flex-column align-items-start align-self-stretch">
        
        <div class="description d-flex flex-column align-items-start align-self-stretch">
          <div class="description-header">
            {getDescriptionHeader()}
          </div>
          <div class="description-body align-self-stretch">
            {getDescription()}
          </div>
        </div>

        <DraggableList 
          className="d-flex flex-column align-items-start align-self-stretch" 
          itemList={state} 
          setState={setState} 
          updateOrder={(newList) => setList(newList)}
        >
          {
            state.map((card, index) => {
              console.log(index)
              return (
                <SortableItem 
                  id={card.id} 
                  key={card.id} 
                  buttonClassName={"draggable-button"}
                  componentStyle={{
                    background: 'white',
                    borderRadius: '6px',
                    padding: '24px',
                    marginBottom: '16px',
                    boxShadow: '0px 1px 5px #ADADAD',
                    position: 'relative',
                    //additions to what was taken from customPages
                    width: '100%',
                    flexDirection: 'column',
                    flexFlow: 'nowrap'
                  }}
                >
                  <Collapsible.Advanced
                    className="card"
                    defaultOpen
                    onOpen = {() => toggleOpen({ index, isOpen:true })}
                    onClose = {() => toggleOpen({ index, isOpen:false})}
                  >
                    <input type="file" id={"term_image_upload"+index} hidden onChange={() => saveTermImage(index)} />
                    <input type="file" id={"definition_image_upload"+index} hidden onChange={() => saveDefinitionImage(index)}/>
                    <Collapsible.Trigger className="card-heading">
                      <div class="drag-spacer" />
                      <div class='card-heading d-flex align-items-center align-self-stretch'>
                        <div class='card-number'>{index+1}</div>
                        {!card.editorOpen ? 
                          <div className="d-flex justify-content-between w-100">
                            <span>
                              {type==='flashcards' ?
                                <span className="preview-term d-inline-block align-middle">
                                  {card.term_image!=='' ? <img class="img-preview" src={card.term_image}/> : <Icon className="img-preview" src={InsertPhoto} />}
                                </span>
                                : ''
                              }
                              {card.term!=='' ? card.term : <span className='text-gray'>No text</span>}
                            </span>
                            <span>
                              {type==='flashcards' ?
                                <span className="preview-definition d-inline-block align-middle">
                                  {card.definition_image!=='' ? <img class="img-preview" src={card.definition_image}/> : <Icon className="img-preview" src={InsertPhoto} />}
                                </span>
                                : ''
                              }
                              {card.definition!=='' ? card.definition : <span className='text-gray'>No text</span>}
                            </span>
                            <span></span>
                          </div>
                         : <div class='card-spacer d-flex align-self-stretch'></div>
                        }
                        {
                          //isOpen needs to stay in the onToggle since the event is the second parameter onToggle is expecting
                        }
                        <Dropdown onToggle={(isOpen, e) => e.stopPropagation()}>
                          <Dropdown.Toggle
                            className='card-dropdown'
                            as={IconButton}
                            src={MoreHoriz}
                            iconAs={Icon}
                            variant="primary"
                          />
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => moveCardUp(index)}>Move up</Dropdown.Item>
                            <Dropdown.Item onClick={() => moveCardDown(index)}>Move down</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => removeCard({ index })}>Delete</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>

                      </div>
                      <Collapsible.Visible whenClosed>
                        <div>
                        <IconButton 
                          src={ExpandMore}
                          iconAs={Icon}
                          alt={"EXPAND"}
                          variant="primary" 
                        />
                        </div>
                      </Collapsible.Visible>
                      <Collapsible.Visible whenOpen>
                        <div>
                        <IconButton
                          src={ExpandLess}
                          iconAs={Icon}
                          alt={"COLLAPSE"}
                          variant="primary" 
                        />
                        </div>
                      </Collapsible.Visible>
                    </Collapsible.Trigger>
                    <div className="card-body p-0">
                    <Collapsible.Body>
                      <div class="card-body-divider">
                        <div class="card-divider"></div>
                      </div>
                      <div class="card-term d-flex flex-column align-items-start align-self-stretch">
                        Term
                        {(type!=='matching' && card.term_image!=='') && 
                          <div class="card-image-area d-flex align-items-center align-self-stretch">
                            <img class="card-image" src={card.term_image}/>
                            <IconButton 
                              src={DeleteOutline}
                              iconAs={Icon}
                              alt={"DEL_IMG"}
                              variant="primary"
                              onClick={() => removeTermImage(index)}//updateTermImage({index, term_image: ''})}
                            />
                          </div>
                        }
                        <div class="card-input-line d-flex align-items-start align-self-stretch">
                          <Form.Control
                            className="d-flex flex-column align-items-start align-self-stretch"
                            id={'term' + index}
                            placeholder="Enter your term"
                            value={ card.term }
                            onChange={ (e) => updateTerm({index, term: e.target.value}) }
                          />
                          {type!=='matching' && 
                            <IconButton
                              src={InsertPhoto}
                              iconAs={Icon}
                              alt={"IMG"}
                              variant="primary"
                              onClick={ () => document.getElementById('term_image_upload'+index).click() }//() => updateTermImage({index, term_image: 'https://logos.openedx.org/open-edx-logo-color.png'})}
                            />  
                          }
                        </div>
                      </div>
                      <div class="card-divider"></div>
                      <div class="card-definition d-flex flex-column align-items-start align-self-stretch">
                        Definition
                        {(type!=='matching' && card.definition_image!=='') && 
                          <div class="card-image-area d-flex align-items-center align-self-stretch">
                            <img class="card-image" src={card.definition_image}/>
                            <IconButton 
                              src={DeleteOutline}
                              iconAs={Icon}
                              alt={"DEL_IMG"}
                              variant="primary"
                              onClick={() => removeDefintionImage(index)}//updateDefinitionImage({index, definition_image: ''})}
                            />
                          </div>
                        }
                        <div class="card-input-line d-flex align-items-start align-self-stretch">
                          <Form.Control
                            className="d-flex flex-column align-items-start align-self-stretch"
                            id={'definition' + index}
                            placeholder="Enter your definition"
                            value={ card.definition }
                            onChange={ (e) => updateDefinition({index, definition: e.target.value}) }
                          />
                          {type!=='matching' && 
                            <IconButton 
                              src={InsertPhoto}
                              iconAs={Icon}
                              alt={"IMG"}
                              variant="primary"
                              onClick={() => document.getElementById('definition_image_upload'+index).click() }//updateDefinitionImage({index, definition_image: 'https://logos.openedx.org/open-edx-logo-color.png'})}
                            />
                          }
                        </div>
                      </div>
                    </Collapsible.Body>
                    </div>
                  </Collapsible.Advanced>
                </SortableItem>
              )
            })
          }
        </DraggableList>

        <Button 
          class="add-button" 
          onClick={ () => addCard() }
        >
          <IconButton 
            src={Add}
            iconAs={Icon}
            alt={"ADD"}
            variant="primary"
          />
          Add
        </Button>
      </div>

      <div class="sidebar d-flex flex-column align-items-start flex-shrink-0">
        <SettingsOption
          class="sidebar-type d-flex flex-column align-items-start align-self-stretch"
          title="Type"
          summary={type.substr(0,1).toUpperCase() + type.substr(1)} //summary is the current value (using substring and toUpperCase to display properly)
          isCardCollapsibleOpen="true"
        >
          <Button 
            onClick={() => updateType("flashcards")}
            className='type-button'
          >
            <span className='small text-primary-500'>Flashcards</span>
            <span hidden={type!=='flashcards'}><Icon src={Check} className="text-success" /></span>
          </Button>
          <div class="card-divider"></div>
          <Button 
            onClick={() => updateType("matching")}
            className='type-button'
          >
            <span className='small text-primary-500'>Matching</span>
            <span hidden={type!=='matching'}><Icon src={Check} className="text-success" /></span>
          </Button>
        </SettingsOption>

        <SettingsOption
          class="sidebar-shuffle d-flex flex-column align-items-start align-self-stretch"
          title="Shuffle"
          summary={settings.shuffle ? "On" : "Off"}
          isCardCollapsibleOpen="true"
        >
          <>
            <div class="settings-description">Shuffle the order of terms shown to learners when reviewing.</div>
            <Button
              onClick={ () => shuffleFalse() }
              variant={!settings.shuffle ? 'primary': 'outline-primary'}
              className='toggle-button rounded-0'
            >
              Off
            </Button>
            <Button
              onClick={ () => shuffleTrue() }
              variant={settings.shuffle ? 'primary': 'outline-primary'}
              className='toggle-button rounded-0'
            >
              On
            </Button>
          </>
        </SettingsOption>

        {type === 'matching' &&
          <SettingsOption
            class="sidebar-timer d-flex flex-column align-items-start align-self-stretch"
            title="Timer"
            summary={settings.timer ? "On" : "Off"}
            isCardCollapsibleOpen="true"
          >
            <>
              <div class="settings-description">Measure the time it takes learners to match all terms and definitions. Used to calculate a learner's score.</div>
              <Button 
                onClick={ () => timerFalse() }
                variant={!settings.timer ? 'primary': 'outline-primary'}
                className='toggle-button rounded-0'
              >
                Off
              </Button>
              <Button 
                onClick={ () => timerTrue() }
                variant={settings.timer ? 'primary': 'outline-primary'}
                className='toggle-button rounded-0'
              >
                On
              </Button>
            </>
          </SettingsOption>
        }
      </div>
    </div>
  </EditorContainer>
);}

GameEditor.defaultProps = {
  blockValue: null,
  lmsEndpointUrl: null,
};
GameEditor.propTypes = {
  onClose: PropTypes.func.isRequired,
  // redux
  blockValue: PropTypes.shape({
    data: PropTypes.shape({ data: PropTypes.string }),
  }),
  lmsEndpointUrl: PropTypes.string,
  blockFailed: PropTypes.bool.isRequired,
  blockFinished: PropTypes.bool.isRequired,
  initializeEditor: PropTypes.func.isRequired,
  // inject
  intl: intlShape.isRequired,
};

export const mapStateToProps = (state) => ({
  blockValue: selectors.app.blockValue(state),
  lmsEndpointUrl: selectors.app.lmsEndpointUrl(state),
  blockFailed: selectors.requests.isFailed(state, { requestKey: RequestKeys.fetchBlock }),
  blockFinished: selectors.requests.isFinished(state, { requestKey: RequestKeys.fetchBlock }),

  //Settings (timer, shuffle, [eventually add type to settings])
  settings: selectors.game.settings(state),

  //Type
  type: selectors.game.type(state),

  //List
  list: selectors.game.list(state),
});

export const mapDispatchToProps = {
  initializeEditor: actions.app.initializeEditor,

  //Shuffle
  shuffleTrue: actions.game.shuffleTrue,
  shuffleFalse: actions.game.shuffleFalse,

  //Timer
  timerTrue: actions.game.timerTrue,
  timerFalse: actions.game.timerFalse,

  //Type
  updateType: actions.game.updateType,

  //List
  updateTerm: actions.game.updateTerm,
  updateTermImage: actions.game.updateTermImage,
  updateDefinition: actions.game.updateDefinition,
  updateDefinitionImage: actions.game.updateDefinitionImage,
  toggleOpen: actions.game.toggleOpen,
  setList: actions.game.setList,
  addCard: actions.game.addCard,
  removeCard: actions.game.removeCard,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(GameEditor));
