import { useState } from 'react';

const EditableUserProfile = ({ user, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...user });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSave = () => {
        setIsEditing(false);
        onSave(formData);
    };

    return (
        <div className="max-w-sm shadow-lg rounded-lg overflow-hidden">
            <div className="relative">
                <img className="w-full h-48 object-cover" src={formData.profileImage} alt="Profile" />
                {isEditing && (
                    <input 
                        type="text" 
                        name="profileImage"
                        value={formData.profileImage} 
                        onChange={handleChange}
                        className="absolute top-0 left-0 w-full h-48 bg-black bg-opacity-50 text-white p-2"
                        placeholder="Enter new profile image URL"
                    />
                )}
            </div>
            <div className="p-6">
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 mb-2 border rounded"
                            placeholder="Enter name"
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 mb-2 border rounded"
                            placeholder="Enter email"
                        />
                        <input
                            type="text"
                            name="joinedDate"
                            value={formData.joinedDate}
                            onChange={handleChange}
                            className="w-full p-2 mb-2 border rounded"
                            placeholder="Enter joined date"
                        />
                        <input
                            type="number"
                            name="friendsCount"
                            value={formData.friendsCount}
                            onChange={handleChange}
                            className="w-full p-2 mb-2 border rounded"
                            placeholder="Enter number of friends"
                        />
                        <input
                            type="text"
                            name="group"
                            value={formData.group}
                            onChange={handleChange}
                            className="w-full p-2 mb-2 border rounded"
                            placeholder="Enter group"
                        />
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-semibold text-gray-800">{formData.name}</h2>
                        <p className="text-gray-600">{formData.email}</p>
                        <div className="mt-4">
                            <p className="text-gray-600">
                                <span className="font-bold">Joined:</span> {formData.joinedDate}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-bold">Friends:</span> {formData.friendsCount}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-bold">Group:</span> {formData.group}
                            </p>
                        </div>
                    </>
                )}

                <div className="mt-4 flex justify-between">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                    {isEditing && (
                        <button
                            onClick={handleSave}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Save
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EditableUserProfile;
