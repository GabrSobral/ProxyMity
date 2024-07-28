﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using ProxyMity.Infra.Database.Contexts;

#nullable disable

namespace ProxyMity.Infra.Database.Migrations
{
    [DbContext(typeof(DataContext))]
    [Migration("20240716215506_AddExternalLogin")]
    partial class AddExternalLogin
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.6")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("ProxyMity.Domain.Entities.EmailConfirmation", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("character varying(26)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("ExpiresAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("IsUsed")
                        .HasColumnType("boolean");

                    b.Property<Guid>("Token")
                        .HasMaxLength(255)
                        .HasColumnType("uuid");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("character varying(26)");

                    b.HasKey("Id");

                    b.HasIndex("Token");

                    b.HasIndex("UserId");

                    b.ToTable("email_confirmation");
                });

            modelBuilder.Entity("ProxyMity.Domain.Entities.ExternalLogin", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("Provider")
                        .HasColumnType("integer");

                    b.Property<string>("ProviderKey")
                        .IsRequired()
                        .HasMaxLength(128)
                        .HasColumnType("character varying(128)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("character varying(26)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.HasIndex("Provider", "ProviderKey")
                        .IsUnique();

                    b.ToTable("external_login");
                });

            modelBuilder.Entity("ProxyMity.Domain.Entities.PasswordResetToken", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("ExpiresAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Token")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("character varying(26)");

                    b.HasKey("Id");

                    b.HasIndex("Token");

                    b.HasIndex("UserId");

                    b.ToTable("password_reset_token");
                });

            modelBuilder.Entity("ProxyMity.Domain.Entities.RefreshToken", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("character varying(26)");

                    b.Property<int>("AvailableRefreshes")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<DateTime>("ExpiryDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("character varying(26)");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("refresh_token");
                });

            modelBuilder.Entity("ProxyMity.Domain.Entities.User", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("character varying(26)");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.Property<bool>("IsActive")
                        .HasColumnType("boolean");

                    b.Property<bool>("IsEmailConfirmed")
                        .HasColumnType("boolean");

                    b.Property<string>("PasswordHash")
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("boolean");

                    b.Property<string>("TwoFactorSecret")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.ToTable("user");
                });

            modelBuilder.Entity("ProxyMity.Domain.Entities.UserProfile", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("character varying(26)");

                    b.Property<string>("Address")
                        .HasColumnType("text");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("character varying(255)");

                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(15)
                        .HasColumnType("character varying(15)");

                    b.Property<string>("PhotoUrl")
                        .HasColumnType("text");

                    b.HasKey("UserId");

                    b.ToTable("user_profile");
                });

            modelBuilder.Entity("ProxyMity.Domain.Entities.EmailConfirmation", b =>
                {
                    b.HasOne("ProxyMity.Domain.Entities.User", "User")
                        .WithMany("EmailConfirmations")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("ProxyMity.Domain.Entities.ExternalLogin", b =>
                {
                    b.HasOne("ProxyMity.Domain.Entities.User", "User")
                        .WithMany("ExternalLogins")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("ProxyMity.Domain.Entities.PasswordResetToken", b =>
                {
                    b.HasOne("ProxyMity.Domain.Entities.User", "User")
                        .WithMany("PasswordResetTokens")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("ProxyMity.Domain.Entities.RefreshToken", b =>
                {
                    b.HasOne("ProxyMity.Domain.Entities.User", "User")
                        .WithMany("RefreshTokens")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("ProxyMity.Domain.Entities.UserProfile", b =>
                {
                    b.HasOne("ProxyMity.Domain.Entities.User", "User")
                        .WithOne("UserProfile")
                        .HasForeignKey("ProxyMity.Domain.Entities.UserProfile", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("ProxyMity.Domain.Entities.User", b =>
                {
                    b.Navigation("EmailConfirmations");

                    b.Navigation("ExternalLogins");

                    b.Navigation("PasswordResetTokens");

                    b.Navigation("RefreshTokens");

                    b.Navigation("UserProfile")
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
