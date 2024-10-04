export const imgPath = (image)=>{
    const updatedProfileImg = image && image.replace(/\\/g, '%5C');

    return `https://youthadda.s3.ap-south-1.amazonaws.com/undefined/`+image;
}

export const filterList = [
    {
        filter:null,
        name:"Original"
    },
    {
        filter:"grayscale",
        name:"Grayscale"
    },
    {
        filter:"sepia",
        name:"Sepia"
    },
    {
        filter:"invert",
        name:"Invert"
    },
    {
        filter:"blur",
        name:"Blur"
    },
    {
        filter:"brightness",
        name:"Brightness"
    },
    {
        filter:"contrast",
        name:"Contrast"
    },
    {
        filter:"hue-rotate",
        name:"Hue Rotate"
    },
    {
        filter:"saturate",
        name:"Saturate"
    },
    {
        filter:"opacity",
        name:"Opacity"
    },
    {
        filter:"drop-shadow",
        name:"Drop Shadow"
    },
    {
        filter:"contrast(150%) saturate(120%)",
        name:"Boost"
    }
]