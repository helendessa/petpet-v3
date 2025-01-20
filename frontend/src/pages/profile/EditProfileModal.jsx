import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const EditProfileModal = ({ user, onProfileUpdate }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        bio: "",
        link: "",
        newPassword: "",
        currentPassword: "",
    });
    const [profileImage, setProfileImage] = useState(null);
    const [coverImg, setCoverImg] = useState(null);

    const profileImgRef = useRef(null);
    const coverImgRef = useRef(null);

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || "",
                username: user.username || "",
                email: user.email || "",
                bio: user.bio || "",
                link: user.link || "",
                newPassword: "",
                currentPassword: "",
            });
            setProfileImage(user.profileImage || null);
            setCoverImg(user.coverImg || null);
        }
    }, [user]);

    const queryClient = useQueryClient();

    const { mutate: updateUser, isLoading } = useMutation({
        mutationFn: async (formData) => {
            const res = await fetch("/api/users/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            queryClient.invalidateQueries({ queryKey: ["userProfile", user?.username] });
            toast.success("Profile updated successfully");
            document.getElementById("edit_profile_modal").close();
            onProfileUpdate();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImgChange = (e, state) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (state === "profileImage") {
                    setProfileImage(reader.result);
                } else if (state === "coverImg") {
                    setCoverImg(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateUser({ ...formData, profileImage, coverImg });
    };

    return (
        <>
            <button
                className='btn btn-outline rounded-full btn-sm'
                onClick={() => document.getElementById("edit_profile_modal").showModal()}
            >
                Edit profile
            </button>
            <dialog id='edit_profile_modal' className='modal'>
                <div className='modal-box border rounded-md border-gray-700 shadow-md'>
                    <h3 className='font-bold text-lg my-3'>Update Profile</h3>
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                        <div className='flex flex-wrap gap-2'>
                            <input
                                type='text'
                                placeholder='Full Name'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.fullName}
                                name='fullName'
                                onChange={handleInputChange}
                            />
                            <input
                                type='text'
                                placeholder='Username'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.username}
                                name='username'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <input
                                type='email'
                                placeholder='Email'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.email}
                                name='email'
                                onChange={handleInputChange}
                            />
                            <textarea
                                placeholder='Bio'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.bio}
                                name='bio'
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <input
                                type='password'
                                placeholder='Current Password'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.currentPassword}
                                name='currentPassword'
                                onChange={handleInputChange}
                            />
                            <input
                                type='password'
                                placeholder='New Password'
                                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                                value={formData.newPassword}
                                name='newPassword'
                                onChange={handleInputChange}
                            />
                        </div>
                        <input
                            type='text'
                            placeholder='Link'
                            className='flex-1 input border border-gray-700 rounded p-2 input-md'
                            value={formData.link}
                            name='link'
                            onChange={handleInputChange}
                        />
                        <div className='flex flex-wrap gap-2'>
                            <div className='flex flex-col'>
                                <label className='text-sm'>Profile Image</label>
                                <input
                                    type='file'
                                    accept='image/*'
                                    ref={profileImgRef}
                                    onChange={(e) => handleImgChange(e, "profileImage")}
                                />
                                {profileImage && <img src={profileImage} alt='Profile' className='w-20 h-20 rounded-full' />}
                            </div>
                            <div className='flex flex-col'>
                                <label className='text-sm'>Cover Image</label>
                                <input
                                    type='file'
                                    accept='image/*'
                                    ref={coverImgRef}
                                    onChange={(e) => handleImgChange(e, "coverImg")}
                                />
                                {coverImg && <img src={coverImg} alt='Cover' className='w-20 h-20' />}
                            </div>
                        </div>
                        <button className='btn btn-primary rounded-full btn-sm text-white'>
                            {isLoading ? "Updating..." : "Update"}
                        </button>
                    </form>
                </div>
                <form method='dialog' className='modal-backdrop'>
                    <button className='outline-none'>close</button>
                </form>
            </dialog>
        </>
    );
};
export default EditProfileModal;