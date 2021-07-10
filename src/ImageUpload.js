import React from 'react';
import { useState } from 'react';
import {Button} from "@material-ui/core";
import {db ,storage} from './firebase'; 
import './ImageUpload.css'
import firebase from 'firebase'
function ImageUpload({username}) {
    const [image,setImage] = useState('')
    const [progress,setProgress] = useState('')
    const [caption ,setCaption] = useState('')

    const handleChange = (e)=>{
        if (e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };
    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        
        uploadTask.on(
        "state_changed",
        (snapshot) => {
            //progress function ...
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
        },
        (error) => {
            //error function
            console.log(error);
            alert(error.messsage);
        },
        () => {
            //complete function
            storage
             .ref('images')
             .child(image.name)
             .getDownloadURL()
             .then(url => {
                 db.collection("posts").add({
                     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                     caption:caption,
                     imageUrl:url,
                     username:username
                 });
                 setProgress(0);
                 setCaption("");
                 setImage(null);
             })
        }
    )
    } 
    return (
        <div className="imageUpload">
            {/*we will have*/}
            {/*input caption*/}
            {/*file picker*/}
            {/*post button*/}
            <progress className="imageupload_progress" value={progress} max="100" />
            <input type="text" placeholder='Enter a caption...' onChange= {event => setCaption(event.target.value)} />
            <input type="file" onChange={handleChange}/>
            <Button onClick={handleUpload}>
               Upload    
            </Button> 
       
        </div>
    )
}

export default ImageUpload
