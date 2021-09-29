import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { Member } from "../interfaces/member.interface";
import { MemberAttendance } from "../interfaces/member-attendance.interface";


@Injectable({
  providedIn: 'root'
})
export class MemberService {
  /**
   *
   */
  constructor(private http: HttpClient) {  }

  getAllMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(`${environment.baseUrl}/member-list`);
  }

  addPerson(body: MemberAttendance): Observable<{ok: boolean, status: number}> {
    return this.http.post<{ok: boolean, status: number}>(`${environment.baseUrl}/member-attendance`, body);
  }
}