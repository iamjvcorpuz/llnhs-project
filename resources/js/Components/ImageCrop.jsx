import React, { useState, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { Head, Link } from '@inertiajs/react';
import { EachMethod } from '@/Components/EachMethod';
import getCroppedImg from './CropImages';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
// import ReactCrop, { Crop } from 'react-image-crop'
// import 'react-image-crop/src/ReactCrop.scss';

export const ImageCrop = ({ src,onChange }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null);

    const onCropComplete = (croppedArea, croppedAreaPixels) => { 
      setCroppedAreaPixels(croppedAreaPixels)
    }
    const showCroppedImage = async () => {
        try {
          const croppedImage = await getCroppedImg(
            src,
            croppedAreaPixels,
            rotation
          ) 
          setCroppedImage(croppedImage);
          onChange(croppedImage)
        } catch (e) {
          console.error(e)
        }
    }
    return (
        <div className="col-lg-12">
            <div className='col-lg-12' style={{height:"50vh"}}> 
                <div className='crop-app'>
                    <div className="crop-container">
                        <Cropper
                            image={src}
                            crop={crop}
                            zoom={zoom}
                            aspect={2 / 2}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>
                    <div className="controls">
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => {
                                setZoom(e.target.value)
                            }}
                            className="zoom-range"
                        /> 
                    </div>

                </div> 
            </div> 
            <button className='btn btn-primary btn-block float-right' onClick={() => { 
                $("#fileuploadpanel").modal('hide');
                showCroppedImage()
            }}>Done</button>
        </div>
    )
}
