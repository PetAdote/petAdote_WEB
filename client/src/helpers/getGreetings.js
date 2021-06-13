const getGreetings = () => {
    const hourNow = new Date().getHours();

    if (hourNow >= 6 && hourNow < 12){
        return 'Bom dia';
    }

    if (hourNow >= 12 && hourNow < 18){
        return 'Boa tarde'
    }

    if (hourNow >= 18 || (hourNow >= 0 && hourNow < 6)){
        return 'Boa noite';
    }   
}

export default getGreetings;