using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProxyMity.Infra.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddConversationPinnedAtToParticipantEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ConversationPinnedAt",
                table: "participant",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Friendship",
                columns: table => new
                {
                    RequesterId = table.Column<string>(type: "character varying(26)", nullable: false),
                    TargetId = table.Column<string>(type: "character varying(26)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AcceptedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeniedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Friendship", x => new { x.TargetId, x.RequesterId });
                    table.ForeignKey(
                        name: "FK_Friendship_user_RequesterId",
                        column: x => x.RequesterId,
                        principalTable: "user",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Friendship_user_TargetId",
                        column: x => x.TargetId,
                        principalTable: "user",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "notification",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(26)", nullable: false),
                    NotificationType = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ReadAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UserId = table.Column<string>(type: "character varying(26)", nullable: false),
                    ConversationId = table.Column<string>(type: "character varying(26)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_notification", x => x.Id);
                    table.ForeignKey(
                        name: "FK_notification_conversation_ConversationId",
                        column: x => x.ConversationId,
                        principalTable: "conversation",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_notification_user_UserId",
                        column: x => x.UserId,
                        principalTable: "user",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Friendship_RequesterId",
                table: "Friendship",
                column: "RequesterId");

            migrationBuilder.CreateIndex(
                name: "IX_notification_ConversationId",
                table: "notification",
                column: "ConversationId");

            migrationBuilder.CreateIndex(
                name: "IX_notification_UserId",
                table: "notification",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Friendship");

            migrationBuilder.DropTable(
                name: "notification");

            migrationBuilder.DropColumn(
                name: "ConversationPinnedAt",
                table: "participant");
        }
    }
}
