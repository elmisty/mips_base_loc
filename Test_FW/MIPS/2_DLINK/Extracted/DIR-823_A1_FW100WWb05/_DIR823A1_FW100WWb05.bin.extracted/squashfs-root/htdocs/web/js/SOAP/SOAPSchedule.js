function SOAPTimeInfo(){this.TimeHourValue="";this.TimeMinuteValue="";this.TimeMidDateValue=false}function SOAPScheduleInfo(){this.ScheduleDate="";this.ScheduleAllDay=false;this.ScheduleTimeFormat=false;this.ScheduleStartTimeInfo=new SOAPTimeInfo();this.ScheduleEndTimeInfo=new SOAPTimeInfo()}function SOAPScheduleInfoLists(){var a=new SOAPScheduleInfo();this.ScheduleName="";this.ScheduleInfo=$.makeArray(a)}function SOAPGetScheduleSettingsResponse(){var a=new SOAPScheduleInfoLists();this.ScheduleInfoLists=$.makeArray(a)}function SOAPGetScheduleRebootResponse(){this.Schedule=new SOAPScheduleInfoLists()}function SOAPSetScheduleReboot(){this.Schedule=new SOAPScheduleInfoLists()};