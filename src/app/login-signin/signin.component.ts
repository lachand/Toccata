import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";
import PouchDB from "pouchdb";
import { UserService } from "../services/user.service";
import { Headers, Http } from "@angular/http";

// Dirty
declare const require: any;
PouchDB.plugin(require("pouchdb-authentication"));

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./style-login-signin/login-signin.scss"]
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  teacher: any;
  error: Array<any>;

  constructor(
    public user: UserService,
    public router: Router,
    public formBuilder: FormBuilder,
    public http: Http
  ) {}

  ngOnInit() {
    this.signinForm = this.formBuilder.group({
      username: "",
      password: "",
      name: "",
      surname: "",
      passwordCheck: "",
      avatar:
        "https://mondesfrancophones.com/wp-content/Cimy_User_Extra_Fields/clarouche/Christian%20Larouche.JPG"
    });
    this.teacher = false;
    this.error = [];
    this.errorReset();
  }

  errorReset() {
    this.error["passwordCheck"] = false;
    this.error["passwordEmpty"] = false;
    this.error["nameEmpty"] = false;
    this.error["usernameEmpty"] = false;
    this.error["surnameEmpty"] = false;
    this.error["avatarEmpty"] = false;
  }

  checked() {
    let checked = true;
    console.log(this.signinForm.value);
    if (
      this.signinForm.value.password !== this.signinForm.value.passwordCheck
    ) {
      this.error["passwordCheck"] = true;
      checked = false;
    }
    if (this.signinForm.value.password === "") {
      this.error["passwordEmpty"] = true;
      checked = false;
    }
    if (this.signinForm.value.name === "") {
      this.error["nameEmpty"] = true;
      checked = false;
    }
    if (this.signinForm.value.username === "") {
      this.error["usernameEmpty"] = true;
      checked = false;
    }
    if (this.signinForm.value.surname === "") {
      this.error["surnameEmpty"] = true;
      checked = false;
    }
    if (this.signinForm.value.avatar === "") {
      this.error["avatarEmpty"] = true;
      checked = false;
    }
    return checked;
  }

  signup(): void {
    this.errorReset();
    if (this.checked()) {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");

      this.user
        .signup(this.signinForm.value.username, this.signinForm.value.password)
        .then(result => {
          return this.user.createUser(
            this.signinForm.value.username,
            this.signinForm.value.name,
            this.signinForm.value.surname,
            this.signinForm.value.password,
            this.signinForm.value.avatar,
            this.teacher
          );
        })
        .then(newUser => {
          console.log(`user created : ${newUser}`);
          this.router.navigate(["/login"]);
        })
        .catch(err => {
          console.log(`Error in signup component whith call to signup : 
          ${err}`);
        });
    }
  }

  isTeacher() {
    this.teacher = !this.teacher;
  }

  goToConnection() {
    this.router.navigate(["/login"]);
  }
}
