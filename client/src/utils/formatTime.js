export const formatTime = (dateString) => {
    if(!dateString) return '';
    const date = new Date(dateString);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
};

export const getOtherUser = (user, participants) => {
    if(!user || !participants) return null;
    return participants[0]._id === user._id ? participants[1] : participants[0];
};
