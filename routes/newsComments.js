const NewsComments = require('../models/NewsComments');
const User = require("../models/User");
const express = require("express");
const router = express.Router();

router.get('/:newsId',async (req,res)=>{
    try {
        if(req.body.newsId === req.params.newsId){
            const comment = await NewsComments.find({
                newsId:req.params.newsId,
            });
            if(!comment){
                return res.status(404).json("Not Found");
            }
            return res.status(200).json(comment);
        }
        else{
            return res.status(401).json({msg:"Unauthorized"});
        }   
    } catch (error) {
        return res.status(500).json("Server Error!");
    }
});

//Post the new comment 
router.post('/:newsId/:userId',async (req,res)=>{
    try {
        if(req.body.newsId === req.params.newsId && 
            req.body.userId === req.params.userId){

            let newComment;

            if(req.body.parentId){
                newComment = new NewsComments({
                    newsId:req.body.newsId,
                    userId:req.body.userId,
                    parentCommentId:req.body.parentId,
                    content:req.body.content
                });
                await newComment.save();
            }
            else{
                newComment = new NewsComments({
                    newsId:req.body.newsId,
                    userId:req.body.userId,
                    content:req.body.content
                });
                await newComment.save();
            }
            return res.status(200).json(newComment);
        }
        else{
            return res.status(401).json("Unauthorized!");
        }
    } catch (error) {
        return res.status(500).json("Server Error!")
    }
});

//Delete news comment
router.delete('/:newsId/:commentId',async(req,res)=>{
    try {
        if(req.body.newsId === req.params.newsId && req.body.commentId === req.params.commentId){
             User.findById(req.body.userId)
            .then((user)=>{
                if(user){
                    console.log(user);
                }
                else{
                    return res.status(401).json("Unauthorized!");
                }
            });
        }
        else{
            return res.status(401).json("Unauthorized!");
        }
    } catch (error) {
        return res.status(500).send({msg:"server error!"});
    }
});

module.exports = router;