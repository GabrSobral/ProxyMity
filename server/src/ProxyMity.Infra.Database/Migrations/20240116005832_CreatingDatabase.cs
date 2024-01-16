using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProxyMity.Infra.Database.Migrations
{
    /// <inheritdoc />
    public partial class CreatingDatabase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "group",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(26)", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying(26)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_group", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "user",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(26)", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Password = table.Column<string>(type: "text", nullable: false),
                    LastOnline = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PhotoUrl = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "conversation",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(26)", nullable: false),
                    GroupId = table.Column<string>(type: "character varying(26)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DisabledAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_conversation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_conversation_group_GroupId",
                        column: x => x.GroupId,
                        principalTable: "group",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "message",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(26)", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    ConversationId = table.Column<string>(type: "character varying(26)", nullable: false),
                    WrittenAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    SentAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ReceivedByAllAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ReadByAllAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RepliedMessageId = table.Column<string>(type: "character varying(26)", nullable: true),
                    AuthorId = table.Column<string>(type: "character varying(26)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_message", x => x.Id);
                    table.ForeignKey(
                        name: "FK_message_conversation_ConversationId",
                        column: x => x.ConversationId,
                        principalTable: "conversation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_message_message_RepliedMessageId",
                        column: x => x.RepliedMessageId,
                        principalTable: "message",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_message_user_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "user",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "participant",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "character varying(26)", nullable: false),
                    ConversationId = table.Column<string>(type: "character varying(26)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RemovedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_participant", x => new { x.UserId, x.ConversationId });
                    table.ForeignKey(
                        name: "FK_participant_conversation_ConversationId",
                        column: x => x.ConversationId,
                        principalTable: "conversation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_participant_user_UserId",
                        column: x => x.UserId,
                        principalTable: "user",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "message_status",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "character varying(26)", nullable: false),
                    MessageId = table.Column<string>(type: "character varying(26)", nullable: false),
                    ConversationId = table.Column<string>(type: "character varying(26)", nullable: false),
                    ReadAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ReceivedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_message_status", x => new { x.UserId, x.ConversationId, x.MessageId });
                    table.ForeignKey(
                        name: "FK_message_status_conversation_ConversationId",
                        column: x => x.ConversationId,
                        principalTable: "conversation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_message_status_message_MessageId",
                        column: x => x.MessageId,
                        principalTable: "message",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_message_status_user_UserId",
                        column: x => x.UserId,
                        principalTable: "user",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_conversation_GroupId",
                table: "conversation",
                column: "GroupId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_message_AuthorId",
                table: "message",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_message_ConversationId",
                table: "message",
                column: "ConversationId");

            migrationBuilder.CreateIndex(
                name: "IX_message_RepliedMessageId",
                table: "message",
                column: "RepliedMessageId");

            migrationBuilder.CreateIndex(
                name: "IX_message_status_ConversationId",
                table: "message_status",
                column: "ConversationId");

            migrationBuilder.CreateIndex(
                name: "IX_message_status_MessageId",
                table: "message_status",
                column: "MessageId");

            migrationBuilder.CreateIndex(
                name: "IX_participant_ConversationId",
                table: "participant",
                column: "ConversationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "message_status");

            migrationBuilder.DropTable(
                name: "participant");

            migrationBuilder.DropTable(
                name: "message");

            migrationBuilder.DropTable(
                name: "conversation");

            migrationBuilder.DropTable(
                name: "user");

            migrationBuilder.DropTable(
                name: "group");
        }
    }
}
