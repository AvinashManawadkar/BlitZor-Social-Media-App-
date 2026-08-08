import { useEffect, useState } from "react";
import API from "../api/axios";


function Feed(){

    const [posts,setPosts] = useState([]);


    useEffect(()=>{

        fetchPosts();

    },[]);



    const fetchPosts = async()=>{

        try{

            const response = await API.get("/posts");

            setPosts(response.data);

        }
        catch(error){

            console.log(error);

        }

    }



    return (

        <div>

            <h1>PulseSocial Feed</h1>


            {
                posts.map(post=>(

                    <div key={post.id}>

                        <h3>
                            {post.fullName}
                        </h3>

                        <span>
                            @{post.username}
                        </span>


                        <p>
                            {post.content}
                        </p>


                        {
                            post.imageUrl &&

                            <img 
                              src={
                              "http://localhost:8080"+post.imageUrl
                              }
                              width="300"
                            />

                        }


                        <small>
                            {post.createdAt}
                        </small>


                    </div>

                ))
            }


        </div>

    )

}


export default Feed;