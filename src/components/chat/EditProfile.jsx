import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { updateProfile } from '../../services/operations/profileApi';
import { setUser } from '../../slices/profileSlice'

const EditableUserProfile = ({ edit, user, onSave, onClose }) => {
    const User = useSelector(state => state.profile.user);
    const {token} = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(edit);
    const [formData, setFormData] = useState({ ...user });
    const fileRef = useRef(null)
    const [imageFile, setImageFile] = useState(null)
    const [previewSource, setPreviewSource] = useState(null)
    const [loading, setLoading] = useState(false)
    // console.log(edit, user)
    const handleChange = (e) => {
        const { firstName, lastName, value } = e.target;
        setFormData({
            ...formData,
            [e.target.name]: value,
        });
    };

    const handleSave = async () => {
        setLoading(true)
        setIsEditing(false);
        onClose(false);
        const data = await onSave(formData, token);
        const updatedUser = {
            ...User,
            firstName: data.firstName,
            lastName: data.lastName,
        };
        dispatch(setUser(updatedUser));
        setLoading(false)
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            previewFile(file)
        }
    }
    const previewFile = (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setPreviewSource(reader.result)
        }
    }
    const handleClick = () => {
        fileRef.current.click()
    }
    const handleUpload = async () => {
        setLoading(true)
        const data = new FormData()
        data.append('image', imageFile)
        const res = await updateProfile(data, token)
        const updatedUser = {
            ...User,
            image: {
                url: res.url,
                public_id: res.public_id,
            },
        };
        localStorage.setItem('user', JSON.stringify(updatedUser))
        dispatch(setUser(updatedUser));
        setLoading(false)
    }

    useEffect(() => {
        if (imageFile) {
            previewFile(imageFile)
        }
    }, [imageFile])

    const timestampToDate = (timestamp) => {
        return moment(timestamp).format("DD-MM-YYYY");
    }
    return (
        <div className="w-full  overflow-hidden ">
            <div className="flex justify-center items-center gap-5 flex-col">
                {!isEditing ?
                    (<img className="w-full h-40 rounded-full bg-black bg-opacity-50 p-2 sm:w-40 object-cover" src={formData.image.url} alt="Profile" />) : (
                        <>
                            <img
                                type="file"
                                name="profileImage"
                                src={previewSource ? previewSource : formData.image.url}
                                className="  w-40 h-40 bg-black bg-opacity-50 text-white p-2 rounded-full"
                                placeholder="Enter new profile image URL"
                            />

                            <input type="file" ref={fileRef} onChange={handleFileChange} className='hidden' accept='image/png, , image/jpeg, image/jpg, image/gif' />

                            <div className='flex gap-20'>
                                <button
                                    onClick={handleClick}
                                    className='bg-[#3a363f] py-2 px-4 rounded'
                                    disabled={loading}>
                                    Select
                                </button>
                                <button
                                    onClick={handleUpload}
                                    className='bg-[#6420cb] py-2 px-4 rounded'
                                    disabled={loading}>
                                    {loading ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </>
                    )}
            </div>
            <div className="flex  mt-5 ">
                <div>
                    {isEditing ? (
                        <div className='flex gap-5 w-full '>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-2/5 p-2 mb-2 h-full rounded bg-black/30"
                                placeholder="Enter first name"
                            />
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-2/5 p-2 mb-2 rounded bg-black/30"
                                placeholder="Enter last name"
                            />
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className={`bg-green-500 text-white  h-10 px-2 rounded hover:bg-green-600 ${!isEditing ? 'hidden' : ''} `}
                            >
                                Save
                            </button>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800">{formData.name}</h2>
                            <p className="text-gray-600">{formData.email}</p>
                            <div className="mt-4">
                                <p className="text-gray-600">
                                    <span className="font-bold">Joined:</span> {timestampToDate(formData.updatedAt)}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-bold">Friends:</span> {formData.chats.length}
                                </p>
                                <p className="text-gray-600">
                                    <span className="font-bold">Group:</span> {formData.channels.length}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                {/* <button
                    onClick={handleSave}
                    className={`bg-green-500 text-white px-5 text-md rounded hover:bg-green-600 ${!isEditing ? 'hidden' : ''} `}
                >
                    Save
                </button> */}
            </div>
        </div>
    );
}

export default EditableUserProfile;
