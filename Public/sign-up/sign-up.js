
async function signUp(e) {
    try {
        e.preventDefault()
        const name = e.target.name.value;
        const email = e.target.email.value;
        const phonenumber = e.target.phonenumber.value ;
        const password = e.target.password.value;

        const signUpObj = {
            name,
            email,
            phonenumber,
            password
        }
        const user = await axios.post("http://localhost:3000/user/sign-up", signUpObj)
        if (user.status === 200) {
            console.log(user);
            alert("user sign-up successfully");
            window.location.href = "http://localhost:3000/login/login.html"
        } else {
            throw new Error("user not created");
        }
    }
    catch (err) {
        console.log(err.response.status);
        if (err.response.status === 500) {
            window.alert("user is alredy exist, Please login");
        } else {
            window.alert(err);
        }
    }
}