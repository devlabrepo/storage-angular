import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEventType, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Myfile } from './myfile';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  progress: number;
  selectedFile: File[] = [];
  myfiles = new Array<Myfile>();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getFiles();
  }

  onSelected(event) {
    this.selectedFile = <File[]>event.target.files;

  }

  onUpload() {
    const formData = new FormData();

    for (let i = 0; i < this.selectedFile.length; i++) {
      formData.append("file", this.selectedFile[i]);
    }
    this.http.post("http://localhost:8080/api/files", formData, { reportProgress: true, observe: "events" })
      .subscribe(event => {

        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round((event.loaded / event.total) * 100);
          console.log([event.loaded, event.total]);
        } else if (event.type === HttpEventType.Response) {
          console.log(event);
        }

      }, err => { console.log(err) },
        () => {
          this.getFiles();
        })
  }

  getFiles() {
    this.myfiles = [];
    this.http.get<Array<Myfile>>("http://localhost:8080/api/files").subscribe(res => {
      res.map(r => this.myfiles.push(r));
    }, (err) => {
      console.log(err);
    }, () => {

    })
  }

  delete(path: string) {
    this.http.delete(path).subscribe(res => {

    }, (err) => {
      console.log(err);
    }, () => {
      this.getFiles();


    })

  }

  // download(path: string) {
  //   console.log(path);
  //   this.http.get<Array<Myfile>>(path).subscribe(res => {
  //     res.map(r => this.myfiles.push(r));
  //   }, (err) => {
  //     console.log(err);
  //   }, () => {

  //   })

  // }

  // download(path: string) {
  //   this.http.get(path, { responseType: 'blob' }).subscribe(res => {
  //     saveAs(res);
  //   }, (err) => {
  //     console.log(err);

  //   }, () => {

  //   })
  // }

}

