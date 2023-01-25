/****************************************************************************/
/*
 * Copyright (C) 2000-2012 ZyXEL Communications, Corp.
 * All Rights Reserved.
 *
 * ZyXEL Confidential; 
 * Protected as an unpublished work, treated as confidential, 
 * and hold in trust and in strict confidence by receiving party. 
 * Only the employees who need to know such ZyXEL confidential information 
 * to carry out the purpose granted under NDA are allowed to access. 
 * 
 * The computer program listings, specifications and documentation 
 * herein are the property of ZyXEL Communications, Corp. and shall 
 * not be reproduced, copied, disclosed, or used in whole or in part 
 * for any reason without the prior express written permission of 
 * ZyXEL Communications, Corp.
 * 
 * Spade Ying, 2012/Sept.
 */
/****************************************************************************/

#define NOTIFY_DEBUG
#define MAX_LINE_IN_FILE		100

#define WRITE_NOTIFY_INVALID_LEVEL	-101
#define WRITE_NOTIFY_NULL_NAME		-102
#define WRITE_NOTIFY_NULL_MSG		-103

#define READ_NOTIFY_FILE_NOT_FOUND	-104
#define READ_NOTIFY_NULL_MSG		-105
#define READ_NOTIFY_INVALID_LINE	-106

#define NOTIFY_FILE			"/tmp/.notify"

typedef struct notify_msg {
	char time[32];
	char name[32];
	int level;
	char msg[128];
} app_notify;

int app_notify_write(char *name, int level, char *msg);
int app_notify_read(int line_num, app_notify *buf);

