import React, { useState } from 'react'
import UploadImg from './UploadImg'

const class_to_idx = {'abstract': 0,
                'cityscape': 1,
                'figurative': 2,
                'flower-painting': 3,
                'genre-painting': 4,
                'landscape': 5,
                'marina': 6,
                'portrait': 7,
                'religious-painting': 8,
                'still-life': 9}

const num = [1, 4, 16, 25, 36]

export default function Model() {
    const [optionValue, setOptionValue] = useState("")
    const [plotOK, setplotOK] = useState(false)
    const [imgValue, setImgValue] = useState("")
    const [imgCount, setImgCount] = useState(1)

    const postClass = () =>{
        fetch('/model',{
            'method': "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"genre": optionValue, "count": imgCount})
        })
        .then(response => response.json())
        .then(data => {
            setplotOK(true)
            setImgValue(data['imgValue'])
        })
        .catch(error => {
            console.log(error)
            setplotOK(false)
        })
    }

    const handleClassSelect = (e) => {
        setOptionValue(e.target.value)
    }
    const handleCountSelect = (e) => {
        console.log(e.target.value)
        setImgCount(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("submit " + optionValue)
        if (optionValue === "") { return }
        console.log("cont")
        postClass()

    }

    const ClassesDropdown = () =>
        <select name="classes" value={optionValue} onChange={handleClassSelect}>
            <option key="default_value" value=""> Click to see options </option>
            {
            Object.entries(class_to_idx)
            .map(([key, value]) => <option key={"class_"+value} value={value}>{key}</option>)
            }
        </select>
                
    const NumDropdown = () =>
        <select name="Count" value={imgCount} onChange={handleCountSelect}>
            {
                num.map((n) => <option key={"num_" + n} value={n}> {n} </option>)
            }
        </select>


    return (
        <div>
            <UploadImg />
            { plotOK &&
                <>
                    <h1>Generated plot</h1>
                    <img src={`data:image/png;base64,${imgValue}`} alt="RANDOM" />
                </>
            }
            <h3>Generate an Art?</h3>
            <form onSubmit={handleSubmit}>
                <label>Choose a class  </label>
                <ClassesDropdown />
                <br />
                <label>No. of images  </label><NumDropdown /><br />
                <input type="submit" value="Send Form"></input>
            </form>
        </div>
    )

}
