import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { Row, Col } from 'react-flexbox-grid'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Alert from './Alert'
import * as EditFacePhotoActions from '../actions/editFacePhoto'

import defaultPhoto from '../img/default_photo.png'

const styles = {
  fullWidth: {
    width: '100%'
  },
  buttons: {
    marginTop: '16px'
  }
}

class EditFacePhoto extends Component {

  clickImg = (e) => {
    e.preventDefault()

    document.getElementById('file-uploader').click()
  }

  submitFacePhoto = (e) => {
    e.preventDefault()

    const { bandId, photoUrl } = this.props

    if (!photoUrl) {
      return
    }

    this.props.onTouchGoNext(bandId, photoUrl)
  }

  goBack = (e) => {
    this.props.onTouchGoPrev()
  }

  changePhoto = (e) => {
    const { bandId, actions } = this.props

    const file = e.target.files[0]

    if (!file) return

    if(!/image/.test(file.type)) {
      actions.alertNotImage()
      return
    }

    actions.changePhoto(bandId, file)
  }

  render() {
    const { photoUrl, photoAlt, faces, scale, alertOpen, alertMessage, canGoNext, actions } = this.props

    let list = []
    faces.map(obj => {
      const face = obj.faceRectangle
      const style = {
        left: face.left * scale + "px" ,
        top: face.top * scale + "px" ,
        width: face.width * scale + "px" ,
        height: face.height * scale + "px",
        position: 'absolute',
        border: '4px solid rgb(100, 221, 23)'
      }
      return list.push(
        <div key={obj.faceId} style={style}></div>
      )
    })

    return (
      <Row className='edit-face-photo'>
        <Col xs={12}>
          <form
            encType='multipart/form-data'
            onSubmit={this.submitFacePhoto}
          >
            <Row>
              <Col xs={12}>
                <a
                  href=""
                  onClick={this.clickImg}>
                  <img
                    id="AA"
                    src={photoUrl ? photoUrl : defaultPhoto}
                    alt={photoAlt}
                    ref={el => this.el = el}
                    style={styles.fullWidth}
                  />
                  {list}
                </a>
                <input
                  id="file-uploader"
                  type="file"
                  accept="image/*"
                  onChange={this.changePhoto}
                  style={{display: 'none'}}
                />
              </Col>
            </Row>
            <Row style={styles.buttons}>
              <Col xs={6}>
                <RaisedButton
                  label='次へ'
                  type='submit'
                  disabled={!canGoNext}
                  primary={true}
                  style={styles.fullWidth}
                />
              </Col>
              <Col xs={6}>
                <FlatButton
                  label="戻る"
                  onTouchTap={this.goBack}
                  style={styles.fullWidth}
                />
              </Col>
            </Row>
          </form>
          <Alert
            onCloseAlert={actions.closeAlert}
            open={alertOpen}
            message={alertMessage}
          />
        </Col>
      </Row>
    )
  }
}

EditFacePhoto.propTypes = {
  onTouchGoNext: PropTypes.func.isRequired,
  onTouchGoPrev: PropTypes.func.isRequired,
  bandId: PropTypes.string.isRequired,
}

function mapStateToProps(state) {
  return {
    photoUrl: state.editFacePhoto.photoUrl,
    photoAlt: state.editFacePhoto.photoAlt,
    faces: state.editFacePhoto.faces,
    scale: state.editFacePhoto.scale,
    alertOpen: state.editFacePhoto.alertOpen,
    alertMessage: state.editFacePhoto.alertMessage,
    canGoNext: state.editFacePhoto.canGoNext,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(EditFacePhotoActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditFacePhoto)
