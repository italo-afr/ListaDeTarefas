drop extension if exists "pg_net";

revoke delete on table "public"."profiles" from "anon";

revoke insert on table "public"."profiles" from "anon";

revoke references on table "public"."profiles" from "anon";

revoke select on table "public"."profiles" from "anon";

revoke trigger on table "public"."profiles" from "anon";

revoke truncate on table "public"."profiles" from "anon";

revoke update on table "public"."profiles" from "anon";

revoke delete on table "public"."profiles" from "authenticated";

revoke insert on table "public"."profiles" from "authenticated";

revoke references on table "public"."profiles" from "authenticated";

revoke select on table "public"."profiles" from "authenticated";

revoke trigger on table "public"."profiles" from "authenticated";

revoke truncate on table "public"."profiles" from "authenticated";

revoke update on table "public"."profiles" from "authenticated";

revoke delete on table "public"."profiles" from "service_role";

revoke insert on table "public"."profiles" from "service_role";

revoke references on table "public"."profiles" from "service_role";

revoke select on table "public"."profiles" from "service_role";

revoke trigger on table "public"."profiles" from "service_role";

revoke truncate on table "public"."profiles" from "service_role";

revoke update on table "public"."profiles" from "service_role";

revoke delete on table "public"."tableList" from "anon";

revoke insert on table "public"."tableList" from "anon";

revoke references on table "public"."tableList" from "anon";

revoke select on table "public"."tableList" from "anon";

revoke trigger on table "public"."tableList" from "anon";

revoke truncate on table "public"."tableList" from "anon";

revoke update on table "public"."tableList" from "anon";

revoke delete on table "public"."tableList" from "authenticated";

revoke insert on table "public"."tableList" from "authenticated";

revoke references on table "public"."tableList" from "authenticated";

revoke select on table "public"."tableList" from "authenticated";

revoke trigger on table "public"."tableList" from "authenticated";

revoke truncate on table "public"."tableList" from "authenticated";

revoke update on table "public"."tableList" from "authenticated";

revoke delete on table "public"."tableList" from "service_role";

revoke insert on table "public"."tableList" from "service_role";

revoke references on table "public"."tableList" from "service_role";

revoke select on table "public"."tableList" from "service_role";

revoke trigger on table "public"."tableList" from "service_role";

revoke truncate on table "public"."tableList" from "service_role";

revoke update on table "public"."tableList" from "service_role";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_public_profile_for_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$function$
;


