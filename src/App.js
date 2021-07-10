import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post.js';
import { auth, db } from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload.js';
import InstagramEmbed from 'react-instagram-embed';
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}


const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function App() {
  const [posts, setPosts] = useState([]);
  const [username, setusername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('false');
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [OpenSignIn, setOpenSignIn] = useState('')
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user has logged in
        console.log(authUser);
        setUser(authUser);
        if (authUser.displayName) {
          //dont update username
        }
        else {
          //if we just created someone
          return authUser.updateProfile({
            displayName: username,
          })
        }
      }
      else {
        //user logged out
        setUser(null);
      }
    })

    return () => {
      //perform some cleanup
      unsubscribe();
    }
  }, [user, username]);
  useEffect(() => {
    //this is where the code runs
    db.collection('posts').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, []);
  const signUp = (event) => {
    event.preventDefault();


    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message))
  }
  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

    setOpenSignIn(false);
  }
  return (
    <div className="App">

      <Modal
        open={open}
        onClose={() => setOpen(false)}

      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
                className="app_headerImage" />
            </center>
            <Input
              placeholder="UserName"
              type="text"
              value={username}
              onChange={(e) => setusername(e.target.value)}
            />
            <Input
              placeholder="e-mail"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp} >Sign Up</Button>
          </form>
        </div>
      </Modal>
      <Modal
        open={OpenSignIn}
        onClose={() => setOpenSignIn(false)}

      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signin">
            <center>
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
                className="app_headerImage" />
            </center>

            <Input
              placeholder="e-mail"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn} >Sign In</Button>
          </form>
        </div>
      </Modal>
      {/*Header*/}
      <div className="app_header">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
          className="app_headerImage"
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Log Out</Button>
        ) :
          <div className="app_loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        }
      </div>


      {/*Posts*/}
      <div className="app_posts">
        <div className="app_postsLeft">
          {
            posts.map(({ id, post }) => (
              <Post key={id} postsId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
        <div className="app_postsRight">
          <InstagramEmbed
            url='https://www.instagram.com/p/B_uf9dmAGPw/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />

        </div>
      </div>

      {user?.displayName ?
        <ImageUpload username={user.displayName} /> :
        <h3>YOU NEED To lOGIN To UPLOAD</h3>
      }
    </div>
  );
}

export default App;
